import mongoose, { Document, Schema } from "mongoose";
import { ProductTypeEnum } from "./ProductType";

// Interface for variant options
interface IVariantOption {
  name: string;
  value: string;
  price?: number;
  sellingPrice?: number;
  inventory: number;
  sku: string;
}

// Interface for size variant
interface ISizeVariant {
  size: string;
  price?: number;
  sellingPrice?: number;
  inventory: number;
  sku: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  mainImage: string;
  allImages: string[];
  type: ProductTypeEnum;
  price: number;
  sellingPrice: number;
  discountAmount: number;
  discountPercentage: number;
  sizeVariants: ISizeVariant[];
  variants: IVariantOption[];
  category: Schema.Types.ObjectId;
  store_id: Schema.Types.ObjectId;
  store: Schema.Types.ObjectId;
  popularityIndex: number;
  orderCount: number;
  reviewCount: number;
  averageRating: number;
  wishlistCount: number;
  inventory: number;
  tags: string[];
  relatedCatalogueProductId?: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual properties (not stored in database)
  inWishlist?: boolean;
  quantityInCart?: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    mainImage: {
      type: String,
      required: [true, "Main image is required"],
    },
    allImages: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["physical", "digital", "appointment"],
      required: [true, "Product type is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    sizeVariants: [
      {
        size: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          min: [0, "Price cannot be negative"],
        },
        sellingPrice: {
          type: Number,
          min: [0, "Selling price cannot be negative"],
        },
        inventory: {
          type: Number,
          required: true,
          min: [0, "Inventory cannot be negative"],
          default: 0,
        },
        sku: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          min: [0, "Price cannot be negative"],
        },
        sellingPrice: {
          type: Number,
          min: [0, "Selling price cannot be negative"],
        },
        inventory: {
          type: Number,
          required: true,
          min: [0, "Inventory cannot be negative"],
          default: 0,
        },
        sku: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: [true, "Product category is required"],
    },
    store_id: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store ID is required"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    popularityIndex: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    wishlistCount: {
      type: Number,
      default: 0,
    },
    inventory: {
      type: Number,
      required: [true, "Inventory is required"],
      min: [0, "Inventory cannot be negative"],
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    relatedCatalogueProductId: {
      type: Schema.Types.ObjectId,
      ref: "CatalogueProduct",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add middleware to exclude soft-deleted documents by default
productSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Calculate discount amount and percentage before saving
productSchema.pre("save", function (next) {
  if (this.price > this.sellingPrice) {
    this.discountAmount = this.price - this.sellingPrice;
    this.discountPercentage = Math.round(
      (this.discountAmount / this.price) * 100
    );
  } else {
    this.discountAmount = 0;
    this.discountPercentage = 0;
  }
  next();
});

// Create text index for search functionality
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

export const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
