import "dotenv/config";
import mongoose from "mongoose";
import { Store } from "../src/models/Store";
import { Product } from "../src/models/Product";
import { CatalogueProduct } from "../src/models/CatalogueProduct";
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
    logger.info("MongoDB connected successfully for creating indexes");
  } catch (error) {
    logger.error(
      `Error connecting to MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error(
      `Error disconnecting from MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Create indexes
const createIndexes = async (): Promise<void> => {
  try {
    // Create text indexes
    logger.info("Creating text indexes...");

    // Helper function to safely recreate an index
    const safeCreateIndex = async (
      collection: mongoose.Collection,
      indexSpec: any,
      options: any,
      collectionName: string
    ) => {
      try {
        // For text indexes, we need to drop any existing text indexes first
        if (Object.values(indexSpec).includes("text")) {
          try {
            // Get all indexes
            const indexes = await collection.indexes();
            // Find any text indexes
            for (const index of indexes) {
              if (index.textIndexVersion) {
                // This is a text index
                if (index.name) {
                  await collection.dropIndex(index.name);
                }
                logger.info(
                  `Dropped existing text index ${index.name} from ${collectionName}`
                );
              }
            }
          } catch (error) {
            logger.error(
              `Error dropping text indexes for ${collectionName}: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
        } else {
          // For non-text indexes, just try to drop the specific index
          try {
            await collection.dropIndex(options.name);
            logger.info(
              `Dropped existing index ${options.name} from ${collectionName}`
            );
          } catch (error) {
            // Index might not exist, which is fine
          }
        }

        // Create the index
        await collection.createIndex(indexSpec, options);
        logger.info(
          `Created index ${options.name} for ${collectionName} collection`
        );
      } catch (error) {
        logger.error(
          `Error creating index for ${collectionName}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    // Store text index
    await safeCreateIndex(
      Store.collection,
      { name: "text", tagline: "text", description: "text" },
      { name: "store_text_index", default_language: "english" },
      "Store"
    );

    // Product text index
    await safeCreateIndex(
      Product.collection,
      { name: "text", description: "text", tags: "text" },
      { name: "product_text_index", default_language: "english" },
      "Product"
    );

    // CatalogueProduct text index
    await safeCreateIndex(
      CatalogueProduct.collection,
      { name: "text", description: "text", tags: "text" },
      { name: "catalogue_product_text_index", default_language: "english" },
      "CatalogueProduct"
    );

    // Create other indexes
    // For geospatial index, we need special handling
    try {
      // Try to drop any existing geospatial indexes
      const indexes = await Store.collection.indexes();
      for (const index of indexes) {
        if (index.key && index.key.location === "2dsphere") {
          if (index.name) {
            await Store.collection.dropIndex(index.name);
          }
          logger.info(
            `Dropped existing geospatial index ${index.name} from Store`
          );
        }
      }

      // Create the geospatial index
      await Store.collection.createIndex(
        { location: "2dsphere" },
        { name: "store_location_index" }
      );
      logger.info("Created geospatial index for Store collection");
    } catch (error) {
      logger.error(
        `Error creating geospatial index: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // isDeleted indexes
    await safeCreateIndex(
      Store.collection,
      { isDeleted: 1 },
      { name: "store_isdeleted_index" },
      "Store"
    );

    await safeCreateIndex(
      Product.collection,
      { isDeleted: 1 },
      { name: "product_isdeleted_index" },
      "Product"
    );

    await safeCreateIndex(
      CatalogueProduct.collection,
      { isDeleted: 1 },
      { name: "catalogueproduct_isdeleted_index" },
      "CatalogueProduct"
    );

    // Popularity indexes
    await safeCreateIndex(
      Store.collection,
      { popularity_index: -1 },
      { name: "store_popularity_index" },
      "Store"
    );

    await safeCreateIndex(
      Product.collection,
      { popularityIndex: -1 },
      { name: "product_popularity_index" },
      "Product"
    );

    await safeCreateIndex(
      CatalogueProduct.collection,
      { popularityIndex: -1 },
      { name: "catalogueproduct_popularity_index" },
      "CatalogueProduct"
    );

    // Store ID index for products
    await safeCreateIndex(
      Product.collection,
      { store_id: 1 },
      { name: "product_storeid_index" },
      "Product"
    );

    logger.info("All indexes created successfully");
  } catch (error) {
    logger.error(
      `Error creating indexes: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Main function
const main = async (): Promise<void> => {
  try {
    await connectDatabase();
    await createIndexes();
  } catch (error) {
    logger.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    await disconnectDatabase();
  }
};

// Run the script
main();
