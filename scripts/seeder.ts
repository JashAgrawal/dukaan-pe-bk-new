import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../src/models/User";
import { StoreCategory } from "../src/models/StoreCategory";
import { ProductCategory } from "../src/models/ProductCategory";
import { Store } from "../src/models/Store";
import { StoreImages } from "../src/models/StoreImages";
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
    await StoreImages.deleteMany({});
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
  const parentCategories = [
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
    // Create parent categories first
    const createdParentCategories = await StoreCategory.create(
      parentCategories
    );
    logger.info(
      `Created ${createdParentCategories.length} parent store categories`
    );

    // Create subcategories for each parent category
    const subcategories: Array<{
      name: string;
      image: string;
      parentId: mongoose.Types.ObjectId;
    }> = [];

    // Fashion subcategories
    const fashionCategory = createdParentCategories.find(
      (cat) => cat.name === "Fashion"
    );
    if (fashionCategory) {
      subcategories.push(
        {
          name: "Men's Clothing",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: fashionCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Women's Clothing",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: fashionCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Footwear",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: fashionCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Kids Wear",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: fashionCategory._id as mongoose.Types.ObjectId,
        }
      );
    }

    // Electronics subcategories
    const electronicsCategory = createdParentCategories.find(
      (cat) => cat.name === "Electronics"
    );
    if (electronicsCategory) {
      subcategories.push(
        {
          name: "Smartphones",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Laptops",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Audio Devices",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Smart Home",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        }
      );
    }

    // Create the subcategories
    const createdSubcategories = await StoreCategory.create(subcategories);
    logger.info(`Created ${createdSubcategories.length} store subcategories`);

    // Return all category IDs (both parent and subcategories)
    return [...createdParentCategories, ...createdSubcategories].map(
      (category) => category._id as Types.ObjectId
    );
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
  const parentCategories = [
    {
      name: "Clothing",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Electronics",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Home Decor",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Beauty",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Books",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Sports",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Toys",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Food",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Health",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
    {
      name: "Jewelry",
      image: "/static/images/uploads/storeorproductMainImage.png",
    },
  ];

  try {
    // Create parent categories first
    const createdParentCategories = await ProductCategory.create(
      parentCategories
    );
    logger.info(
      `Created ${createdParentCategories.length} parent product categories`
    );

    // Create subcategories for each parent category
    const subcategories: Array<{
      name: string;
      image: string;
      parentId: mongoose.Types.ObjectId;
    }> = [];

    // Clothing subcategories
    const clothingCategory = createdParentCategories.find(
      (cat) => cat.name === "Clothing"
    );
    if (clothingCategory) {
      subcategories.push(
        {
          name: "Men's Clothing",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: clothingCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Women's Clothing",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: clothingCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Kids Clothing",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: clothingCategory._id as mongoose.Types.ObjectId,
        }
      );
    }

    // Electronics subcategories
    const electronicsCategory = createdParentCategories.find(
      (cat) => cat.name === "Electronics"
    );
    if (electronicsCategory) {
      subcategories.push(
        {
          name: "Smartphones",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Laptops",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Tablets",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: electronicsCategory._id as mongoose.Types.ObjectId,
        }
      );
    }

    // Home Decor subcategories
    const homeCategory = createdParentCategories.find(
      (cat) => cat.name === "Home Decor"
    );
    if (homeCategory) {
      subcategories.push(
        {
          name: "Furniture",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: homeCategory._id as mongoose.Types.ObjectId,
        },
        {
          name: "Lighting",
          image: "/static/images/uploads/storeorproductMainImage.png",
          parentId: homeCategory._id as mongoose.Types.ObjectId,
        }
      );
    }

    // Create the subcategories
    const createdSubcategories = await ProductCategory.create(subcategories);
    logger.info(`Created ${createdSubcategories.length} product subcategories`);

    // Return all category IDs (both parent and subcategories)
    return [...createdParentCategories, ...createdSubcategories].map(
      (category) => category._id as Types.ObjectId
    );
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
  const users: Array<{
    name: string;
    mobileNumber: string;
    role: string;
  }> = [];

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
  interface StoreData {
    name: string;
    tagline: string;
    description: string;
    owner_id: mongoose.Types.ObjectId;
    business_phone_number: string;
    business_email: string;
    full_address: string;
    city: string;
    state: string;
    country: string;
    serviceable_pincodes: string[];
    isPanIndia: boolean;
    type: ServiceTypeEnum;
    category: mongoose.Types.ObjectId;
    productCategories: mongoose.Types.ObjectId[];
    logo: string;
    coverImage: string;
    mainImage: string;
    allImages: string[];
    facilities: string[];
    termsAndConditions: string;
    returnPolicy: string;
    displayTags: string[];
    sysTags: string[];
    popularity_index: number;
    isBrand: boolean;
    isOpen: boolean;
    opensAt: string;
    closesAt: string;
    is_24_7: boolean;
    location: {
      type: string;
      coordinates: number[];
    };
  }

  const stores: StoreData[] = [];
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
    const pincodes: string[] = [];
    const numPincodes = Math.floor(Math.random() * 6) + 5; // 5 to 10
    for (let i = 0; i < numPincodes; i++) {
      pincodes.push(faker.string.numeric(6));
    }

    // Generate 2-5 facilities
    const facilities: string[] = [];
    const facilityOptions = [
      "Parking",
      "WiFi",
      "Air Conditioning",
      "Home Delivery",
      "Restroom",
      "Wheelchair Access",
      "Fitting Rooms",
      "Gift Wrapping",
      "Cafe",
      "Play Area",
    ];
    const numFacilities = Math.floor(Math.random() * 4) + 2; // 2 to 5

    for (let i = 0; i < numFacilities; i++) {
      const facility =
        facilityOptions[Math.floor(Math.random() * facilityOptions.length)];
      if (!facilities.includes(facility)) {
        facilities.push(facility);
      }
    }

    // Generate 2-4 display tags
    const displayTags: string[] = [];
    const displayTagOptions = [
      "Trending",
      "Popular",
      "New Arrival",
      "Best Seller",
      "Top Rated",
      "Featured",
      "Sale",
      "Limited Edition",
      "Exclusive",
      "Premium",
    ];
    const numDisplayTags = Math.floor(Math.random() * 3) + 2; // 2 to 4

    for (let i = 0; i < numDisplayTags; i++) {
      const tag =
        displayTagOptions[Math.floor(Math.random() * displayTagOptions.length)];
      if (!displayTags.includes(tag)) {
        displayTags.push(tag);
      }
    }

    // Generate 1-3 system tags
    const sysTags: string[] = [];
    const sysTagOptions = [
      "verified",
      "premium",
      "fast-delivery",
      "eco-friendly",
      "organic",
      "handmade",
      "imported",
      "local",
    ];
    const numSysTags = Math.floor(Math.random() * 3) + 1; // 1 to 3

    for (let i = 0; i < numSysTags; i++) {
      const tag =
        sysTagOptions[Math.floor(Math.random() * sysTagOptions.length)];
      if (!sysTags.includes(tag)) {
        sysTags.push(tag);
      }
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
      facilities: facilities,
      termsAndConditions: faker.lorem.paragraphs(2),
      returnPolicy: `${faker.number.int({
        min: 7,
        max: 30,
      })}-day return policy with receipt${
        faker.datatype.boolean() ? " and original packaging" : ""
      }.`,
      displayTags: displayTags,
      sysTags: sysTags,
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

  interface SizeVariant {
    size: string;
    price: number;
    sellingPrice: number;
    inventory: number;
    sku: string;
  }

  interface Variant {
    name: string;
    value: string;
    price: number;
    sellingPrice: number;
    inventory: number;
    sku: string;
  }

  interface ProductData {
    name: string;
    description: string;
    mainImage: string;
    allImages: string[];
    type: ProductTypeEnum;
    price: number;
    sellingPrice: number;
    inventory: number;
    sizeVariants: SizeVariant[];
    variants: Variant[];
    category: mongoose.Types.ObjectId;
    store_id: mongoose.Types.ObjectId;
    store: mongoose.Types.ObjectId;
    popularityIndex: number;
    tags: string[];
  }

  for (const storeId of storeIds) {
    const products: ProductData[] = [];
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
      const randomCategoryId = categoryPool[
        Math.floor(Math.random() * categoryPool.length)
      ] as mongoose.Types.ObjectId;

      const price = faker.number.int({ min: 100, max: 10000 });
      const discountPercentage = faker.number.int({ min: 0, max: 50 });
      const sellingPrice = Math.round(price * (1 - discountPercentage / 100));

      // Generate 0-3 size variants
      const sizeVariants: SizeVariant[] = [];
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
      const variants: Variant[] = [];
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
      const tags: string[] = [];
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

// Create store images collections for each store
const createStoreImages = async (
  storeIds: mongoose.Types.ObjectId[]
): Promise<void> => {
  let totalCollections = 0;

  interface StoreImagesData {
    heading: string;
    store: mongoose.Types.ObjectId;
    images: string[];
  }

  // Collection types with their headings
  const collectionTypes = [
    { type: "gallery", heading: "Store Gallery" },
    { type: "banners", heading: "Promotional Banners" },
    { type: "menu", heading: "Menu" },
  ];

  for (const storeId of storeIds) {
    const storeImagesCollections: StoreImagesData[] = [];

    // Create 2-4 random collections for each store
    const numCollections = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const selectedTypes = [...collectionTypes]
      .sort(() => 0.5 - Math.random())
      .slice(0, numCollections);

    for (const collectionType of selectedTypes) {
      // Generate 3-6 images for each collection
      const images: string[] = [];
      const numImages = Math.floor(Math.random() * 4) + 3; // 3 to 6

      for (let i = 0; i < numImages; i++) {
        images.push("/static/images/uploads/storeorproductMainImage.png");
      }

      storeImagesCollections.push({
        heading: collectionType.heading,
        store: storeId,
        images: images,
      });
    }

    try {
      const createdCollections = await StoreImages.create(
        storeImagesCollections
      );
      totalCollections += createdCollections.length;
      logger.info(
        `Created ${createdCollections.length} image collections for store ${storeId}`
      );
    } catch (error) {
      logger.error(
        `Error creating image collections for store ${storeId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  logger.info(`Created a total of ${totalCollections} store image collections`);
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
    await createStoreImages(storeIds);

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
