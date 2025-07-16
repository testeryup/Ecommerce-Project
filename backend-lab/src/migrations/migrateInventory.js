import mongoose from 'mongoose';
import Inventory from '../models/inventory.js';
import connectDB from '../config/db.config.js';

/**
 * Migration script to update existing inventory to new subscription format
 * Run this script once to migrate existing data
 */

async function migrateInventoryData() {
    try {
        console.log('Starting inventory data migration...');
        
        // Connect to database
        await connectDB();
        
        // Find all existing inventory items that need migration
        const oldInventoryItems = await Inventory.find({
            // Items that still use old credentials format (string)
            'credentials': { $type: 'string' }
        });
        
        console.log(`Found ${oldInventoryItems.length} items to migrate`);
        
        for (const item of oldInventoryItems) {
            const oldCredentials = item.credentials;
            
            // Try to parse old credentials
            let newCredentials = {
                username: '',
                password: '',
                email: '',
                additionalInfo: ''
            };
            
            // Check if credentials contain username:password format
            if (typeof oldCredentials === 'string') {
                const parts = oldCredentials.split(':');
                if (parts.length >= 2) {
                    newCredentials.username = parts[0].trim();
                    newCredentials.password = parts[1].trim();
                    if (parts.length > 2) {
                        newCredentials.additionalInfo = parts.slice(2).join(':').trim();
                    }
                } else {
                    // Treat as license key or single credential
                    newCredentials.key = oldCredentials;
                    newCredentials = { key: oldCredentials, additionalInfo: '' };
                }
            }
            
            // Set default values for new fields
            const updateData = {
                credentials: newCredentials,
                accountType: newCredentials.key ? 'key' : 'subscription',
                currentSubscription: {
                    buyer: item.order ? await getOrderBuyer(item.order) : null,
                    order: item.order || null,
                    startDate: null,
                    endDate: null,
                    isActive: false
                },
                usageHistory: [],
                autoReset: {
                    enabled: newCredentials.key ? false : true,
                    resetCount: 0
                },
                notes: ''
            };
            
            // If item was sold, try to extract subscription info
            if (item.status === 'sold' && item.order) {
                const order = await mongoose.model('Order').findById(item.order);
                if (order) {
                    updateData.currentSubscription.buyer = order.buyer;
                    updateData.currentSubscription.startDate = order.createdAt;
                    // Assume 30 days subscription if not specified
                    updateData.currentSubscription.endDate = new Date(order.createdAt.getTime() + (30 * 24 * 60 * 60 * 1000));
                    updateData.currentSubscription.isActive = new Date() < updateData.currentSubscription.endDate;
                }
            }
            
            await Inventory.findByIdAndUpdate(item._id, updateData);
            console.log(`Migrated item ${item._id}`);
        }
        
        console.log('Migration completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

async function getOrderBuyer(orderId) {
    try {
        const order = await mongoose.model('Order').findById(orderId).select('buyer');
        return order ? order.buyer : null;
    } catch (error) {
        return null;
    }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateInventoryData();
}

export default migrateInventoryData;
