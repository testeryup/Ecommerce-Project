const request = require('supertest');
const app = require('../../backend-lab/src/server.js');

describe('SKU Management API Tests', () => {
    let authToken;
    let productId;
    let skuId;
    let categoryId;

    const testUser = {
        email: 'sku.test@example.com',
        password: 'password123',
        username: 'skutest',
        role: 'seller'
    };

    const testCategory = {
        name: 'SKU Test Category',
        description: 'Category for SKU testing',
        subcategories: ['Gaming', 'Software']
    };

    const testProduct = {
        name: 'SKU Test Product',
        description: 'Product for testing SKU functionality',
        category: '',
        subcategory: 'Gaming',
        images: ['base64image'],
        skus: [
            {
                name: 'Basic SKU',
                price: 50000,
                originalPrice: 70000,
                stock: 100,
                subscriptionInfo: {
                    duration: 30,
                    autoRenewable: true,
                    renewalPrice: 45000
                }
            }
        ]
    };

    beforeAll(async () => {
        try {
            // Register and login user
            await request(app)
                .post('/api/auth/register')
                .send(testUser);

            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            authToken = loginResponse.body.token;

            // Create category
            const categoryResponse = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testCategory);

            categoryId = categoryResponse.body.data._id;
            testProduct.category = categoryId;

            // Create product
            const productResponse = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testProduct);

            productId = productResponse.body.data._id;
            skuId = productResponse.body.data.skus[0]._id;

        } catch (error) {
            console.error('SKU test setup error:', error);
        }
    });

    afterAll(async () => {
        // Cleanup
        if (productId) {
            await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`);
        }
        if (categoryId) {
            await request(app)
                .delete(`/api/categories/${categoryId}`)
                .set('Authorization', `Bearer ${authToken}`);
        }
    });

    describe('POST /api/skus - Create SKU', () => {
        test('Should create new SKU for existing product', async () => {
            const newSku = {
                productId: productId,
                name: 'Premium SKU',
                price: 99000,
                originalPrice: 120000,
                stock: 50,
                subscriptionInfo: {
                    duration: 90,
                    autoRenewable: true,
                    renewalPrice: 89000
                }
            };

            const response = await request(app)
                .post('/api/skus')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newSku);

            expect(response.status).toBe(201);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data.name).toBe(newSku.name);
            expect(response.body.data.subscriptionInfo.duration).toBe(90);
        });

        test('Should fail to create SKU without authentication', async () => {
            const newSku = {
                productId: productId,
                name: 'Unauthorized SKU',
                price: 50000,
                stock: 10
            };

            const response = await request(app)
                .post('/api/skus')
                .send(newSku);

            expect(response.status).toBe(401);
        });

        test('Should validate SKU data', async () => {
            const invalidSku = {
                productId: productId,
                name: '', // Empty name
                price: -1000, // Negative price
                stock: 'invalid' // Invalid stock type
            };

            const response = await request(app)
                .post('/api/skus')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidSku);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });

        test('Should validate subscription info in SKU', async () => {
            const skuWithInvalidSubscription = {
                productId: productId,
                name: 'Invalid Subscription SKU',
                price: 50000,
                stock: 10,
                subscriptionInfo: {
                    duration: 0, // Invalid duration
                    autoRenewable: 'maybe', // Invalid boolean
                    renewalPrice: -5000 // Invalid price
                }
            };

            const response = await request(app)
                .post('/api/skus')
                .set('Authorization', `Bearer ${authToken}`)
                .send(skuWithInvalidSubscription);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('GET /api/skus/:id - Get SKU Details', () => {
        test('Should get SKU by ID', async () => {
            const response = await request(app)
                .get(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data._id).toBe(skuId);
            expect(response.body.data.name).toBe('Basic SKU');
        });

        test('Should return 404 for non-existent SKU', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/skus/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('PUT /api/skus/:id - Update SKU', () => {
        test('Should update SKU successfully', async () => {
            const updateData = {
                name: 'Updated Basic SKU',
                price: 55000,
                stock: 120,
                subscriptionInfo: {
                    duration: 45,
                    autoRenewable: false,
                    renewalPrice: 50000
                }
            };

            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data.name).toBe(updateData.name);
            expect(response.body.data.price).toBe(updateData.price);
            expect(response.body.data.subscriptionInfo.duration).toBe(45);
        });

        test('Should fail to update without authentication', async () => {
            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .send({ name: 'Unauthorized Update' });

            expect(response.status).toBe(401);
        });

        test('Should validate update data', async () => {
            const invalidUpdate = {
                price: -1000,
                stock: 'invalid'
            };

            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidUpdate);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('DELETE /api/skus/:id - Delete SKU', () => {
        let skuToDelete;

        beforeEach(async () => {
            // Create SKU for deletion test
            const newSku = {
                productId: productId,
                name: 'SKU to Delete',
                price: 30000,
                stock: 20
            };

            const response = await request(app)
                .post('/api/skus')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newSku);

            skuToDelete = response.body.data._id;
        });

        test('Should delete SKU successfully', async () => {
            const response = await request(app)
                .delete(`/api/skus/${skuToDelete}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
        });

        test('Should fail to delete without authentication', async () => {
            const response = await request(app)
                .delete(`/api/skus/${skuToDelete}`);

            expect(response.status).toBe(401);
        });

        test('Should fail to delete non-existent SKU', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .delete(`/api/skus/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('SKU Subscription Features', () => {
        test('Should handle subscription duration validation', async () => {
            const validDurations = [7, 30, 90, 365];
            
            for (const duration of validDurations) {
                const sku = {
                    productId: productId,
                    name: `SKU ${duration}d`,
                    price: 50000,
                    stock: 10,
                    subscriptionInfo: {
                        duration: duration,
                        autoRenewable: true,
                        renewalPrice: 45000
                    }
                };

                const response = await request(app)
                    .post('/api/skus')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(sku);

                expect(response.status).toBe(201);
                expect(response.body.data.subscriptionInfo.duration).toBe(duration);

                // Cleanup
                await request(app)
                    .delete(`/api/skus/${response.body.data._id}`)
                    .set('Authorization', `Bearer ${authToken}`);
            }
        });

        test('Should reject invalid subscription durations', async () => {
            const invalidDurations = [-1, 0, 366, 'invalid'];

            for (const duration of invalidDurations) {
                const sku = {
                    productId: productId,
                    name: 'Invalid Duration SKU',
                    price: 50000,
                    stock: 10,
                    subscriptionInfo: {
                        duration: duration,
                        autoRenewable: true,
                        renewalPrice: 45000
                    }
                };

                const response = await request(app)
                    .post('/api/skus')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(sku);

                expect(response.status).toBe(400);
                expect(response.body.errCode).toBe(1);
            }
        });

        test('Should handle renewal price validation', async () => {
            const sku = {
                productId: productId,
                name: 'Renewal Price Test SKU',
                price: 100000,
                stock: 10,
                subscriptionInfo: {
                    duration: 30,
                    autoRenewable: true,
                    renewalPrice: 150000 // Higher than original price
                }
            };

            const response = await request(app)
                .post('/api/skus')
                .set('Authorization', `Bearer ${authToken}`)
                .send(sku);

            // Should allow renewal price higher than original
            expect(response.status).toBe(201);
            expect(response.body.data.subscriptionInfo.renewalPrice).toBe(150000);

            // Cleanup
            await request(app)
                .delete(`/api/skus/${response.body.data._id}`)
                .set('Authorization', `Bearer ${authToken}`);
        });
    });

    describe('SKU Stock Management', () => {
        test('Should update stock levels', async () => {
            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ stock: 75 });

            expect(response.status).toBe(200);
            expect(response.body.data.stock).toBe(75);
        });

        test('Should handle zero stock', async () => {
            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ stock: 0 });

            expect(response.status).toBe(200);
            expect(response.body.data.stock).toBe(0);
        });

        test('Should reject negative stock', async () => {
            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ stock: -10 });

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('SKU Price Management', () => {
        test('Should update pricing information', async () => {
            const priceUpdate = {
                price: 60000,
                originalPrice: 80000
            };

            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(priceUpdate);

            expect(response.status).toBe(200);
            expect(response.body.data.price).toBe(60000);
            expect(response.body.data.originalPrice).toBe(80000);
        });

        test('Should reject negative prices', async () => {
            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ price: -5000 });

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });

        test('Should handle price equal to original price', async () => {
            const response = await request(app)
                .put(`/api/skus/${skuId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ 
                    price: 50000,
                    originalPrice: 50000
                });

            expect(response.status).toBe(200);
            expect(response.body.data.price).toBe(response.body.data.originalPrice);
        });
    });
});
