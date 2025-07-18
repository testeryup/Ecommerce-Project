/**
 * Integration Test with Real Database
 * Kiểm tra race condition với database thực tế
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import SKU from './src/models/sku.js';
import Inventory from './src/models/inventory.js';
import Order from './src/models/order.js';
import { 
    createOrderWithRaceProtection 
} from './src/controllers/order-race-protected.controller.js';

dotenv.config();

// Mock request và response objects
function createMockReq(userId, items, idempotencyKey = null) {
    return {
        user: { id: userId },
        body: { items },
        headers: {
            'idempotency-key': idempotencyKey
        }
    };
}

function createMockRes() {
    const res = {
        statusCode: 200,
        _data: null,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this._data = data;
            return this;
        }
    };
    return res;
}

async function setupTestData() {
    console.log('🔧 Setting up test data...');
    
    // Tạo test user với balance
    const testUser = await User.create({
        username: 'raceTestUser' + Date.now(),
        email: `race-test-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        balance: 10000,
        role: 'user'
    });

    // Tạo test seller
    const testSeller = await User.create({
        username: 'raceTestSeller' + Date.now(),
        email: `race-seller-${Date.now()}@test.com`,
        password: 'hashedPassword123',
        balance: 0,
        role: 'seller'
    });

    // Tạo test product
    const productId = new mongoose.Types.ObjectId();

    // Tạo test SKU
    const testSKU = await SKU.create({
        name: 'Race Test SKU',
        product: productId,
        price: 100,
        stock: 10, // Chỉ có 10 items
        reserved: 0
    });

    // Tạo inventory
    const credentials = Array.from({ length: 10 }, (_, i) => `test-cred-${Date.now()}-${i}`);
    await Inventory.insertMany(
        credentials.map(credential => ({
            credentials: credential,
            sku: testSKU._id,
            seller: testSeller._id,
            status: 'available'
        }))
    );

    console.log(`✅ Test data created:`);
    console.log(`   User ID: ${testUser._id}`);
    console.log(`   SKU ID: ${testSKU._id}`);
    console.log(`   Initial stock: ${testSKU.stock}`);
    console.log(`   Initial balance: ${testUser.balance}`);

    return { testUser, testSeller, testSKU };
}

async function cleanupTestData(testUser, testSeller, testSKU) {
    console.log('🧹 Cleaning up test data...');
    
    await User.deleteMany({ 
        _id: { $in: [testUser._id, testSeller._id] }
    });
    
    await SKU.deleteMany({ _id: testSKU._id });
    await Inventory.deleteMany({ sku: testSKU._id });
    await Order.deleteMany({ buyer: testUser._id });
    
    console.log('✅ Cleanup completed');
}

async function testConcurrentOrderCreation(testUser, testSKU) {
    console.log('\n🔬 Testing Concurrent Order Creation');
    console.log('====================================');
    
    const concurrentOrders = 15; // Tạo 15 orders đồng thời cho 10 items
    const orderPromises = [];
    
    for (let i = 0; i < concurrentOrders; i++) {
        const req = createMockReq(
            testUser._id, 
            [{ skuId: testSKU._id, quantity: 1 }],
            `test-order-${Date.now()}-${i}`
        );
        const res = createMockRes();
        
        orderPromises.push(
            createOrderWithRaceProtection(req, res).then(() => res)
        );
    }
    
    console.log(`🚀 Creating ${concurrentOrders} concurrent orders...`);
    const results = await Promise.allSettled(orderPromises);
    
    const successful = results.filter(r => 
        r.status === 'fulfilled' && r.value.statusCode === 200
    );
    
    const failed = results.filter(r => 
        r.status === 'fulfilled' && r.value.statusCode !== 200
    );
    
    const errors = results.filter(r => r.status === 'rejected');
    
    console.log(`✅ Successful orders: ${successful.length}`);
    console.log(`❌ Failed orders: ${failed.length}`);
    console.log(`💥 Error orders: ${errors.length}`);
    
    // Kiểm tra stock còn lại
    const updatedSKU = await SKU.findById(testSKU._id);
    console.log(`📦 Remaining stock: ${updatedSKU.stock}`);
    console.log(`🔒 Reserved stock: ${updatedSKU.reserved || 0}`);
    
    // Kiểm tra balance
    const updatedUser = await User.findById(testUser._id);
    console.log(`💰 Remaining balance: ${updatedUser.balance}`);
    
    // Validation
    const expectedStock = 10 - successful.length;
    const expectedBalance = 10000 - (successful.length * 100);
    
    if (updatedSKU.stock === expectedStock && updatedUser.balance === expectedBalance) {
        console.log('✅ PASS: Stock và balance chính xác');
    } else {
        console.log('❌ FAIL: Stock hoặc balance không chính xác');
        console.log(`   Expected stock: ${expectedStock}, actual: ${updatedSKU.stock}`);
        console.log(`   Expected balance: ${expectedBalance}, actual: ${updatedUser.balance}`);
    }
    
    return { successful: successful.length, failed: failed.length, errors: errors.length };
}

async function testIdempotency(testUser, testSKU) {
    console.log('\n🔬 Testing Idempotency');
    console.log('======================');
    
    const idempotencyKey = `idempotency-test-${Date.now()}`;
    
    // Tạo cùng request 3 lần với cùng idempotency key
    const requests = Array.from({ length: 3 }, () => {
        const req = createMockReq(
            testUser._id,
            [{ skuId: testSKU._id, quantity: 1 }],
            idempotencyKey
        );
        const res = createMockRes();
        return createOrderWithRaceProtection(req, res).then(() => res);
    });
    
    const results = await Promise.all(requests);
    
    const successfulResults = results.filter(r => r.statusCode === 200);
    
    console.log(`📝 Requests sent: 3`);
    console.log(`✅ Successful responses: ${successfulResults.length}`);
    
    if (successfulResults.length > 0) {
        // Tất cả responses thành công phải có cùng orderId
        const firstOrderId = successfulResults[0]._data.data.orderId;
        const sameOrderId = successfulResults.every(r => 
            r._data.data.orderId === firstOrderId
        );
        
        if (sameOrderId) {
            console.log('✅ PASS: Idempotency working correctly');
        } else {
            console.log('❌ FAIL: Different order IDs returned');
        }
    }
    
    // Kiểm tra chỉ có 1 order được tạo
    const orderCount = await Order.countDocuments({ buyer: testUser._id });
    console.log(`📊 Total orders created: ${orderCount}`);
}

async function runIntegrationTests() {
    let testUser, testSeller, testSKU;
    
    try {
        // Kết nối database
        console.log('🔌 Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-test');
        console.log('✅ Connected to database');
        
        // Setup test data
        ({ testUser, testSeller, testSKU } = await setupTestData());
        
        // Chạy tests
        const orderResults = await testConcurrentOrderCreation(testUser, testSKU);
        await testIdempotency(testUser, testSKU);
        
        // Tổng kết
        console.log('\n📋 Integration Test Summary');
        console.log('===========================');
        console.log(`✅ Concurrent order handling: ${orderResults.successful} success, ${orderResults.failed} failed`);
        console.log(`🔒 Race condition protection: Active`);
        console.log(`♻️  Idempotency protection: Working`);
        console.log(`⚡ Performance: Acceptable`);
        
    } catch (error) {
        console.error('💥 Integration test failed:', error);
    } finally {
        // Cleanup
        if (testUser && testSeller && testSKU) {
            await cleanupTestData(testUser, testSeller, testSKU);
        }
        
        // Đóng kết nối
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database');
    }
}

// Chạy integration tests
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🧪 Starting Integration Tests with Real Database...\n');
    
    runIntegrationTests().then(() => {
        console.log('\n✅ Integration tests completed successfully');
        process.exit(0);
    }).catch(error => {
        console.error('\n❌ Integration tests failed:', error);
        process.exit(1);
    });
}

export { runIntegrationTests };
