import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../src/models/User";
import { Store } from "../src/models/Store";
import { Product } from "../src/models/Product";
import { StoreCategory } from "../src/models/StoreCategory";
import { ProductCategory } from "../src/models/ProductCategory";
import { logger } from "../src/utils/logger";

// MongoDB connection options
const options = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
};

// Connect to MongoDB
const connectDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGODB_URI as string;
    
    if (!dbUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    
    await mongoose.connect(dbUri, options);
    logger.info("MongoDB connected successfully for verification");
    
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Verify data
const verifyData = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    // Count documents
    const userCount = await User.countDocuments({ role: "seller" });
    const storeCategoryCount = await StoreCategory.countDocuments({});
    const productCategoryCount = await ProductCategory.countDocuments({});
    const storeCount = await Store.countDocuments({});
    const productCount = await Product.countDocuments({});
    
    logger.info(`Users (sellers): ${userCount}`);
    logger.info(`Store Categories: ${storeCategoryCount}`);
    logger.info(`Product Categories: ${productCategoryCount}`);
    logger.info(`Stores: ${storeCount}`);
    logger.info(`Products: ${productCount}`);
    
    // Get sample data
    const users = await User.find({ role: "seller" }).limit(2);
    const stores = await Store.find({}).limit(2);
    const products = await Product.find({}).limit(2);
    
    logger.info("Sample Users:");
    logger.info(JSON.stringify(users, null, 2));
    
    logger.info("Sample Stores:");
    logger.info(JSON.stringify(stores, null, 2));
    
    logger.info("Sample Products:");
    logger.info(JSON.stringify(products, null, 2));
    
  } catch (error) {
    logger.error(`Error verifying data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await disconnectDatabase();
  }
};

// Run the verification
verifyData();
