import mongoose from "mongoose";
import Product from "../models/product.js";
import SKU from "../models/sku.js";
import Inventory from "../models/inventory.js";
import Category from "../models/category.js";

const addIsDeletedToAllCollections = async () => {
  try {
    console.log('Starting migration to add isDeleted field...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://pika:5dbQUO7x4opG7lsS@datmanh.kwmcp.mongodb.net/?retryWrites=true&w=majority&appName=datmanh');
    
    // Array of all models and their collection names
    const collections = [
      { Model: SKU, name: 'skus' },
    ];

    for (const { Model, name } of collections) {
      console.log(`Processing ${name}...`);
      
      // Add isDeleted field to documents that don't have it
      const result = await Model.updateMany(
        { isDeleted: { $exists: false } }, // Only update documents without isDeleted field
        { $set: { isDeleted: false } },
        { multi: true }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} documents in ${name} collection`);
      
      // Count total documents for verification
      const totalCount = await Model.countDocuments({});
      const deletedCount = await Model.countDocuments({ isDeleted: true });
      const activeCount = await Model.countDocuments({ isDeleted: false });
      
      console.log(`📊 ${name} summary: Total: ${totalCount}, Active: ${activeCount}, Deleted: ${deletedCount}`);
    }

    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Run the migration
addIsDeletedToAllCollections()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });

export default addIsDeletedToAllCollections;