import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../src/models/User";
import { StoreCategory } from "../src/models/StoreCategory";
import { ProductCategory } from "../src/models/ProductCategory";
import { Store } from "../src/models/Store";
import { Product } from "../src/models/Product";
import { ServiceTypeEnum } from "../src/models/ServiceType";
import { ProductTypeEnum } from "../src/models/ProductType";
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
    logger.info("MongoDB connected successfully for seeding");
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

// Clear existing data
const clearData = async (): Promise<void> => {
  try {
    await User.deleteMany({ role: "seller" });
    await StoreCategory.deleteMany({});
    await ProductCategory.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    logger.info("Data cleared successfully");
  } catch (error) {
    logger.error(
      `Error clearing data: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Create store categories
const createStoreCategories = async (): Promise<Types.ObjectId[]> => {
  const categories = [
    {
      name: "Fashion",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Electronics",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Home & Kitchen",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Beauty & Personal Care",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Books & Stationery",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Sports & Fitness",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Toys & Games",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Grocery & Gourmet",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Health & Wellness",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Jewelry & Accessories",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
  ];

  try {
    const createdCategories = await StoreCategory.create(categories);
    logger.info(`Created ${createdCategories.length} store categories`);
    return createdCategories.map((category) => category._id as Types.ObjectId);
  } catch (error) {
    logger.error(
      `Error creating store categories: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
};

// Create product categories
const createProductCategories = async (): Promise<
  mongoose.Types.ObjectId[]
> => {
  const categories = [
    {
      name: "Clothing",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Smartphones",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Laptops",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Furniture",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Skincare",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Fiction Books",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Fitness Equipment",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Board Games",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Organic Food",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Vitamins & Supplements",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
  ];

  try {
    const createdCategories = await ProductCategory.create(categories);
    logger.info(`Created ${createdCategories.length} product categories`);
    return createdCategories.map((category) => category._id as Types.ObjectId);
  } catch (error) {
    logger.error(
      `Error creating product categories: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
};

// Create users with seller role
const createUsers = async (
  count: number
): Promise<mongoose.Types.ObjectId[]> => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const mobileNumber = `+91${faker.string.numeric(10)}`;
    users.push({
      name: faker.person.fullName(),
      mobileNumber,
      role: "seller",
    });
  }

  try {
    const createdUsers = await User.create(users);
    logger.info(`Created ${createdUsers.length} users with seller role`);
    return createdUsers.map((user) => user._id as Types.ObjectId);
  } catch (error) {
    logger.error(
      `Error creating users: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
};

// Create stores for each user
const createStores = async (
  userIds: mongoose.Types.ObjectId[],
  storeCategoryIds: mongoose.Types.ObjectId[],
  productCategoryIds: mongoose.Types.ObjectId[]
): Promise<mongoose.Types.ObjectId[]> => {
  const stores = [];
  const serviceTypes: ServiceTypeEnum[] = [
    "physical_product",
    "digital_product",
    "service",
    "restaurant",
    "infomercial",
  ];

  for (const userId of userIds) {
    const randomStoreCategoryId =
      storeCategoryIds[Math.floor(Math.random() * storeCategoryIds.length)];
    // Select 2-4 random product categories
    const selectedProductCategories: Types.ObjectId[] = [];
    const numProductCategories = Math.floor(Math.random() * 3) + 2; // 2 to 4

    for (let i = 0; i < numProductCategories; i++) {
      const randomProductCategoryId =
        productCategoryIds[
          Math.floor(Math.random() * productCategoryIds.length)
        ];
      if (!selectedProductCategories.includes(randomProductCategoryId)) {
        selectedProductCategories.push(randomProductCategoryId);
      }
    }

    // Generate 5-10 random pincodes
    const pincodes = [];
    const numPincodes = Math.floor(Math.random() * 6) + 5; // 5 to 10
    for (let i = 0; i < numPincodes; i++) {
      pincodes.push(faker.string.numeric(6));
    }

    stores.push({
      name: faker.company.name(),
      tagline: faker.company.catchPhrase(),
      description: faker.company.buzzPhrase() + ". " + faker.lorem.paragraph(),
      owner_id: userId,
      business_phone_number: `+91${faker.string.numeric(10)}`,
      business_email: faker.internet.email(),
      full_address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: "India",
      serviceable_pincodes: pincodes,
      isPanIndia: faker.datatype.boolean(),
      type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      category: randomStoreCategoryId,
      productCategories: selectedProductCategories,
      logo: "/static/images/uploads/storeLogo.png",
      coverImage: "/static/images/uploads/storeorproductMainImage.png",
      mainImage: "/static/images/uploads/storeorproductMainImage.png",
      allImages: ["/static/images/uploads/storeorproductMainImage.png"],
      popularity_index: faker.number.int({ min: 0, max: 100 }),
      isBrand: faker.datatype.boolean(),
      isOpen: true,
      opensAt: "09:00",
      closesAt: "21:00",
      is_24_7: faker.datatype.boolean(),
      location: {
        type: "Point",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },
    });
  }

  try {
    const createdStores = await Store.create(stores);
    logger.info(`Created ${createdStores.length} stores`);
    return createdStores.map((store) => store._id as Types.ObjectId);
  } catch (error) {
    logger.error(
      `Error creating stores: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
};

// Create products for each store
const createProducts = async (
  storeIds: mongoose.Types.ObjectId[],
  productCategoryIds: mongoose.Types.ObjectId[],
  productsPerStore: number
): Promise<void> => {
  const productTypes: ProductTypeEnum[] = [
    "physical",
    "digital",
    "appointment",
  ];
  let totalProducts = 0;

  for (const storeId of storeIds) {
    const products = [];
    const store = await Store.findById(storeId);

    if (!store) continue;

    // Get the product categories associated with this store
    const storeProductCategories = store.productCategories;

    for (let i = 0; i < productsPerStore; i++) {
      // Use store's product categories if available, otherwise use random ones
      const categoryPool =
        storeProductCategories.length > 0
          ? storeProductCategories
          : productCategoryIds;
      const randomCategoryId =
        categoryPool[Math.floor(Math.random() * categoryPool.length)];

      const price = faker.number.int({ min: 100, max: 10000 });
      const discountPercentage = faker.number.int({ min: 0, max: 50 });
      const sellingPrice = Math.round(price * (1 - discountPercentage / 100));

      // Generate 0-3 size variants
      const sizeVariants = [];
      const hasSizeVariants = faker.datatype.boolean();

      if (hasSizeVariants) {
        const sizes = ["S", "M", "L", "XL", "XXL"];
        const numSizes = Math.floor(Math.random() * 4); // 0 to 3

        for (let j = 0; j < numSizes; j++) {
          const size = sizes[Math.floor(Math.random() * sizes.length)];
          const variantPrice = price + faker.number.int({ min: 50, max: 500 });
          const variantSellingPrice = Math.round(
            variantPrice * (1 - discountPercentage / 100)
          );

          sizeVariants.push({
            size,
            price: variantPrice,
            sellingPrice: variantSellingPrice,
            inventory: faker.number.int({ min: 5, max: 100 }),
            sku: `SKU-${faker.string.alphanumeric(6)}`,
          });
        }
      }

      // Generate 0-3 other variants
      const variants = [];
      const hasVariants = faker.datatype.boolean();

      if (hasVariants) {
        const variantTypes = ["Color", "Material", "Style"];
        const variantValues = {
          Color: ["Red", "Blue", "Green", "Black", "White"],
          Material: ["Cotton", "Polyester", "Leather", "Metal", "Wood"],
          Style: ["Classic", "Modern", "Vintage", "Casual", "Formal"],
        };

        const numVariants = Math.floor(Math.random() * 4); // 0 to 3

        for (let j = 0; j < numVariants; j++) {
          const name =
            variantTypes[Math.floor(Math.random() * variantTypes.length)];
          const value =
            variantValues[name as keyof typeof variantValues][
              Math.floor(
                Math.random() *
                  variantValues[name as keyof typeof variantValues].length
              )
            ];
          const variantPrice = price + faker.number.int({ min: 50, max: 500 });
          const variantSellingPrice = Math.round(
            variantPrice * (1 - discountPercentage / 100)
          );

          variants.push({
            name,
            value,
            price: variantPrice,
            sellingPrice: variantSellingPrice,
            inventory: faker.number.int({ min: 5, max: 100 }),
            sku: `SKU-${faker.string.alphanumeric(6)}`,
          });
        }
      }

      // Generate 1-5 tags
      const tags = [];
      const numTags = Math.floor(Math.random() * 5) + 1; // 1 to 5

      for (let j = 0; j < numTags; j++) {
        tags.push(faker.word.adjective());
      }

      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        mainImage: "/static/images/uploads/storeorproductMainImage.png",
        allImages: ["/static/images/uploads/storeorproductMainImage.png"],
        type: productTypes[Math.floor(Math.random() * productTypes.length)],
        price,
        sellingPrice,
        inventory: faker.number.int({ min: 10, max: 200 }),
        sizeVariants,
        variants,
        category: randomCategoryId,
        store_id: storeId,
        store: storeId,
        popularityIndex: faker.number.int({ min: 0, max: 100 }),
        tags,
      });
    }

    try {
      const createdProducts = await Product.create(products);
      totalProducts += createdProducts.length;
      logger.info(
        `Created ${createdProducts.length} products for store ${storeId}`
      );
    } catch (error) {
      logger.error(
        `Error creating products for store ${storeId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  logger.info(`Created a total of ${totalProducts} products`);
};

// Main seeder function
const seedData = async (clearExisting: boolean = false): Promise<void> => {
  try {
    await connectDatabase();

    if (clearExisting) {
      await clearData();
    }

    const storeCategoryIds = await createStoreCategories();
    const productCategoryIds = await createProductCategories();
    const userIds = await createUsers(25);
    const storeIds = await createStores(
      userIds,
      storeCategoryIds,
      productCategoryIds
    );
    await createProducts(storeIds, productCategoryIds, 25);

    logger.info("Data seeding completed successfully");
  } catch (error) {
    logger.error(
      `Error seeding data: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    await disconnectDatabase();
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const clearExisting = args.includes("--clear");

// Run the seeder
seedData(clearExisting);
