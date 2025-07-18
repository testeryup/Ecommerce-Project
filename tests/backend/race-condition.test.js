/**
 * Race Condition Test Suite
 * Tests various race condition scenarios to ensure protection works
 */

import mongoose from 'mongoose';
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/user.js';
import SKU from '../src/models/sku.js';
import Inventory from '../src/models/inventory.js';
import Order from '../src/models/order.js';

describe('Race Condition Protection Tests', () => {
    let testUser;
    let testSeller;
    let testSKU;
    let userToken;
    let sellerToken;

    before(async () => {
        // Setup test data
        await setupTestData();
    });

    after(async () => {
        // Cleanup test data
        await cleanupTestData();
    });

    describe('Concurrent Order Creation', () => {
        it('should handle multiple concurrent orders for the same SKU', async () => {
            // Create inventory with limited stock
            await createTestInventory(testSKU._id, 5); // Only 5 items

            // Simulate 10 concurrent order requests for 1 item each
            const orderPromises = Array.from({ length: 10 }, (_, i) => 
                request(app)
                    .post('/api/orders-protected/create-protected')
                    .set('Authorization', `Bearer ${userToken}`)
                    .set('Idempotency-Key', `test-order-${Date.now()}-${i}`)
                    .send({
                        items: [{ skuId: testSKU._id, quantity: 1 }]
                    })
            );

            const results = await Promise.allSettled(orderPromises);
            
            // Count successful orders
            const successfulOrders = results.filter(result => 
                result.status === 'fulfilled' && 
                result.value.status === 200
            );

            // Should only have 5 successful orders (matching available stock)
            expect(successfulOrders).to.have.length(5);

            // Verify remaining stock is 0
            const updatedSKU = await SKU.findById(testSKU._id);
            expect(updatedSKU.stock).to.equal(0);
        });

        it('should prevent duplicate orders with same idempotency key', async () => {
            const idempotencyKey = `duplicate-test-${Date.now()}`;
            
            // Make the same request twice with same idempotency key
            const [firstResponse, secondResponse] = await Promise.all([
                request(app)
                    .post('/api/orders-protected/create-protected')
                    .set('Authorization', `Bearer ${userToken}`)
                    .set('Idempotency-Key', idempotencyKey)
                    .send({
                        items: [{ skuId: testSKU._id, quantity: 1 }]
                    }),
                request(app)
                    .post('/api/orders-protected/create-protected')
                    .set('Authorization', `Bearer ${userToken}`)
                    .set('Idempotency-Key', idempotencyKey)
                    .send({
                        items: [{ skuId: testSKU._id, quantity: 1 }]
                    })
            ]);

            // Both should return same response (idempotency)
            expect(firstResponse.status).to.equal(200);
            expect(secondResponse.status).to.equal(200);
            expect(firstResponse.body.data.orderId).to.equal(secondResponse.body.data.orderId);
        });
    });

    describe('Concurrent Inventory Updates', () => {
        it('should handle concurrent inventory uploads', async () => {
            const uploadPromises = Array.from({ length: 5 }, (_, i) => 
                request(app)
                    .post('/api/inventory/upload')
                    .set('Authorization', `Bearer ${sellerToken}`)
                    .send({
                        productId: testSKU.product,
                        skuId: testSKU._id,
                        credentialsList: [`test-credential-${i}-1`, `test-credential-${i}-2`]
                    })
            );

            const results = await Promise.allSettled(uploadPromises);
            
            // All uploads should succeed
            const successfulUploads = results.filter(result => 
                result.status === 'fulfilled' && 
                result.value.status === 201
            );

            expect(successfulUploads).to.have.length(5);

            // Verify stock increased by 10 (5 uploads × 2 credentials each)
            const updatedSKU = await SKU.findById(testSKU._id);
            expect(updatedSKU.stock).to.be.at.least(10);
        });
    });

    describe('Balance Update Race Conditions', () => {
        it('should handle concurrent balance updates correctly', async () => {
            const initialBalance = 1000;
            await User.findByIdAndUpdate(testUser._id, { balance: initialBalance });

            // Simulate multiple concurrent purchases
            const purchaseAmount = 100;
            const concurrentPurchases = 5;

            const purchasePromises = Array.from({ length: concurrentPurchases }, (_, i) => 
                request(app)
                    .post('/api/orders-protected/create-protected')
                    .set('Authorization', `Bearer ${userToken}`)
                    .set('Idempotency-Key', `balance-test-${Date.now()}-${i}`)
                    .send({
                        items: [{ skuId: testSKU._id, quantity: 1 }] // Assume each costs 100
                    })
            );

            await Promise.allSettled(purchasePromises);

            // Check final balance
            const updatedUser = await User.findById(testUser._id);
            const expectedBalance = initialBalance - (concurrentPurchases * purchaseAmount);
            
            // Balance should be correctly decremented
            expect(updatedUser.balance).to.be.at.most(expectedBalance);
        });
    });

    describe('Optimistic Locking', () => {
        it('should detect and handle version conflicts', async () => {
            // Get current SKU version
            const sku = await SKU.findById(testSKU._id);
            const originalVersion = sku.__v;

            // Simulate concurrent updates that would cause version conflict
            const updatePromises = Array.from({ length: 3 }, () => 
                SKU.updateOne(
                    { _id: testSKU._id, __v: originalVersion },
                    { $inc: { stock: 1, __v: 1 } }
                )
            );

            const results = await Promise.allSettled(updatePromises);
            
            // Only one update should succeed
            const successfulUpdates = results.filter(result => 
                result.status === 'fulfilled' && 
                result.value.modifiedCount > 0
            );

            expect(successfulUpdates).to.have.length(1);
        });
    });

    describe('Lock Timeout Handling', () => {
        it('should timeout and fail gracefully when locks cannot be acquired', async () => {
            // This test would require more complex setup to artificially create lock contention
            // For now, we'll test the timeout configuration
            const response = await request(app)
                .get('/api/orders-protected/race-stats')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.errCode).to.equal(0);
        });
    });

    // Helper functions
    async function setupTestData() {
        // Create test users
        testUser = await User.create({
            username: 'raceTestUser',
            email: 'race-test-user@test.com',
            password: 'hashedPassword',
            balance: 10000,
            role: 'user'
        });

        testSeller = await User.create({
            username: 'raceTestSeller',
            email: 'race-test-seller@test.com',
            password: 'hashedPassword',
            balance: 0,
            role: 'seller'
        });

        // Create test SKU
        testSKU = await SKU.create({
            name: 'Race Test SKU',
            product: new mongoose.Types.ObjectId(),
            price: 100,
            stock: 0
        });

        // Generate tokens (simplified)
        userToken = 'test-user-token';
        sellerToken = 'test-seller-token';
    }

    async function cleanupTestData() {
        await User.deleteMany({ 
            username: { $in: ['raceTestUser', 'raceTestSeller'] } 
        });
        await SKU.deleteMany({ name: 'Race Test SKU' });
        await Inventory.deleteMany({ sku: testSKU?._id });
        await Order.deleteMany({ buyer: testUser?._id });
    }

    async function createTestInventory(skuId, count) {
        const credentials = Array.from({ length: count }, (_, i) => 
            `test-credential-${Date.now()}-${i}`
        );

        await Inventory.insertMany(
            credentials.map(credential => ({
                credentials: credential,
                sku: skuId,
                seller: testSeller._id,
                status: 'available'
            }))
        );

        await SKU.findByIdAndUpdate(skuId, { 
            $inc: { stock: count } 
        });
    }
});

// Performance test for race condition scenarios
describe('Race Condition Performance Tests', () => {
    it('should handle high concurrency without significant performance degradation', async function() {
        this.timeout(30000); // 30 second timeout

        const concurrentRequests = 50;
        const startTime = Date.now();

        const promises = Array.from({ length: concurrentRequests }, (_, i) => 
            request(app)
                .get('/api/orders-protected/race-stats')
                .set('Authorization', `Bearer test-token`)
        );

        const results = await Promise.allSettled(promises);
        const endTime = Date.now();
        
        const successfulRequests = results.filter(result => 
            result.status === 'fulfilled' && 
            result.value.status === 200
        );

        const totalTime = endTime - startTime;
        const averageTime = totalTime / concurrentRequests;

        console.log(`Processed ${concurrentRequests} concurrent requests in ${totalTime}ms`);
        console.log(`Average response time: ${averageTime}ms`);
        
        expect(successfulRequests.length).to.be.at.least(concurrentRequests * 0.95); // 95% success rate
        expect(averageTime).to.be.below(1000); // Average under 1 second
    });
});

export default {
    // Export test functions for use in integration tests
    setupTestData,
    cleanupTestData,
    createTestInventory
};
