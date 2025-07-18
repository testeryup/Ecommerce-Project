const request = require('supertest');
const app = require('../../backend-lab/src/server.js');

describe('Product API Tests', () => {
    let authToken;
    let sellerId;
    let adminToken;
    let productId;
    let categoryId;

    // Mock user data
    const sellerData = {
        email: 'test.seller@example.com',
        password: 'password123',
        username: 'testseller',
        role: 'seller'
    };

    const adminData = {
        email: 'admin@example.com',
        password: 'admin123',
        username: 'admin',
        role: 'admin'
    };

    const testProduct = {
        name: 'Test Product',
        description: 'This is a test product description',
        category: '', // Will be set after creating category
        subcategory: 'Test Subcategory',
        images: ['base64imagestring1', 'base64imagestring2'],
        skus: [
            {
                name: 'Basic Plan',
                price: 99000,
                originalPrice: 120000,
                stock: 100,
                subscriptionInfo: {
                    duration: 30,
                    autoRenewable: true,
                    renewalPrice: 89000
                }
            },
            {
                name: 'Premium Plan',
                price: 199000,
                originalPrice: 250000,
                stock: 50,
                subscriptionInfo: {
                    duration: 90,
                    autoRenewable: true,
                    renewalPrice: 179000
                }
            }
        ]
    };

    const testCategory = {
        name: 'Test Category',
        description: 'Test category for products',
        subcategories: ['Test Subcategory', 'Another Subcategory']
    };

    beforeAll(async () => {
        // Setup test users and get auth tokens
        console.log('Setting up test environment...');
        
        try {
            // Register seller
            const sellerResponse = await request(app)
                .post('/api/auth/register')
                .send(sellerData);
            
            if (sellerResponse.status === 201 || sellerResponse.status === 200) {
                // Login seller
                const sellerLogin = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: sellerData.email,
                        password: sellerData.password
                    });
                
                authToken = sellerLogin.body.token;
                sellerId = sellerLogin.body.user._id;
            }

            // Create test category
            const categoryResponse = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testCategory);
            
            if (categoryResponse.body.data) {
                categoryId = categoryResponse.body.data._id;
                testProduct.category = categoryId;
            }

        } catch (error) {
            console.error('Setup error:', error);
        }
    });

    afterAll(async () => {
        // Cleanup test data
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

    describe('POST /api/products - Create Product', () => {
        test('Should create a new product successfully', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testProduct);

            expect(response.status).toBe(201);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.name).toBe(testProduct.name);
            expect(response.body.data.skus).toHaveLength(2);
            
            productId = response.body.data._id;
        });

        test('Should fail to create product without authentication', async () => {
            const response = await request(app)
                .post('/api/products')
                .send(testProduct);

            expect(response.status).toBe(401);
        });

        test('Should fail to create product with invalid data', async () => {
            const invalidProduct = {
                name: '', // Empty name
                description: testProduct.description
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidProduct);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });

        test('Should fail to create product with invalid SKU data', async () => {
            const productWithInvalidSKU = {
                ...testProduct,
                skus: [
                    {
                        name: 'Invalid SKU',
                        price: -100, // Negative price
                        stock: 'invalid' // Invalid stock type
                    }
                ]
            };

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(productWithInvalidSKU);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });

        test('Should validate subscription info in SKUs', async () => {
            const productWithInvalidSubscription = {
                ...testProduct,
                skus: [
                    {
                        name: 'Invalid Subscription SKU',
                        price: 99000,
                        stock: 10,
                        subscriptionInfo: {
                            duration: -30, // Invalid duration
                            autoRenewable: 'yes' // Should be boolean
                        }
                    }
                ]
            };

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(productWithInvalidSubscription);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('GET /api/products - Get Products', () => {
        test('Should get all products', async () => {
            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test('Should get products with pagination', async () => {
            const response = await request(app)
                .get('/api/products?page=1&limit=5');

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data).toBeDefined();
        });

        test('Should filter products by category', async () => {
            const response = await request(app)
                .get(`/api/products?category=${categoryId}`);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
        });
    });

    describe('GET /api/products/:id - Get Product by ID', () => {
        test('Should get product by valid ID', async () => {
            const response = await request(app)
                .get(`/api/products/${productId}`);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data._id).toBe(productId);
            expect(response.body.data.name).toBe(testProduct.name);
        });

        test('Should return 404 for invalid product ID', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/products/${invalidId}`);

            expect(response.status).toBe(404);
            expect(response.body.errCode).toBe(1);
        });

        test('Should return 400 for malformed product ID', async () => {
            const response = await request(app)
                .get('/api/products/invalid-id');

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/products/:id - Update Product', () => {
        test('Should update product successfully', async () => {
            const updatedData = {
                name: 'Updated Test Product',
                description: 'Updated description',
                skus: [
                    {
                        ...testProduct.skus[0],
                        price: 109000, // Updated price
                        stock: 150 // Updated stock
                    }
                ]
            };

            const response = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(response.body.data.name).toBe(updatedData.name);
            expect(response.body.data.description).toBe(updatedData.description);
        });

        test('Should fail to update without authentication', async () => {
            const response = await request(app)
                .put(`/api/products/${productId}`)
                .send({ name: 'Unauthorized Update' });

            expect(response.status).toBe(401);
        });

        test('Should fail to update non-existent product', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .put(`/api/products/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Update Non-existent' });

            expect(response.status).toBe(404);
            expect(response.body.errCode).toBe(1);
        });

        test('Should validate SKU updates', async () => {
            const invalidUpdate = {
                skus: [
                    {
                        name: '',
                        price: 'invalid',
                        stock: -10
                    }
                ]
            };

            const response = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidUpdate);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('DELETE /api/products/:id - Delete Product', () => {
        let productToDelete;

        beforeEach(async () => {
            // Create a product specifically for deletion test
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    ...testProduct,
                    name: 'Product to Delete'
                });
            
            productToDelete = response.body.data._id;
        });

        test('Should delete product successfully', async () => {
            const response = await request(app)
                .delete(`/api/products/${productToDelete}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
            expect(response.body.message).toContain('deleted');
        });

        test('Should fail to delete without authentication', async () => {
            const response = await request(app)
                .delete(`/api/products/${productToDelete}`);

            expect(response.status).toBe(401);
        });

        test('Should fail to delete non-existent product', async () => {
            const invalidId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .delete(`/api/products/${invalidId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.errCode).toBe(1);
        });
    });

    describe('Product Search and Filter', () => {
        test('Should search products by name', async () => {
            const response = await request(app)
                .get('/api/products?search=Test');

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
        });

        test('Should filter products by price range', async () => {
            const response = await request(app)
                .get('/api/products?minPrice=50000&maxPrice=150000');

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
        });

        test('Should sort products by price', async () => {
            const response = await request(app)
                .get('/api/products?sortBy=price&sortOrder=asc');

            expect(response.status).toBe(200);
            expect(response.body.errCode).toBe(0);
        });
    });

    describe('Product Validation Edge Cases', () => {
        test('Should handle very long product names', async () => {
            const longNameProduct = {
                ...testProduct,
                name: 'A'.repeat(1000) // Very long name
            };

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(longNameProduct);

            expect(response.status).toBe(400);
            expect(response.body.errCode).toBe(1);
        });

        test('Should handle products with many SKUs', async () => {
            const manySkusProduct = {
                ...testProduct,
                name: 'Product with Many SKUs',
                skus: Array(20).fill().map((_, index) => ({
                    name: `SKU ${index + 1}`,
                    price: 10000 + (index * 1000),
                    stock: 10
                }))
            };

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(manySkusProduct);

            // Should either succeed or fail gracefully
            expect([200, 201, 400]).toContain(response.status);
        });

        test('Should handle special characters in product name', async () => {
            const specialCharProduct = {
                ...testProduct,
                name: 'Test Product 特殊字符 émojis 🎮',
                description: 'Description with special chars & symbols!'
            };

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(specialCharProduct);

            expect(response.status).toBe(201);
            expect(response.body.errCode).toBe(0);
            
            // Cleanup
            if (response.body.data && response.body.data._id) {
                await request(app)
                    .delete(`/api/products/${response.body.data._id}`)
                    .set('Authorization', `Bearer ${authToken}`);
            }
        });
    });
});
