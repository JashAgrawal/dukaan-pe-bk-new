import mongoose, { Document, Schema } from "mongoose";
import { ServiceTypeEnum } from "./ServiceType";

export interface IStore extends Document {
  name: string;
  tagline: string;
  description: string;
  owner_id: Schema.Types.ObjectId;
  business_phone_number: string;
  business_email: string;
  full_address: string;
  city: string;
  state: string;
  country: string;
  serviceable_pincodes: string[];
  isPanIndia: boolean;
  type: ServiceTypeEnum;
  category: Schema.Types.ObjectId;
  productCategories: Schema.Types.ObjectId[];
  logo: string;
  coverImage: string;
  mainImage: string;
  allImages: string[];
  popularity_index: number;
  isBrand: boolean;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
  is_24_7: boolean;
  orderCount: number;
  averageRating: number;
  reviewCount: number;
  wishlistCount: number;
  location: {
    type: string;
    coordinates: number[];
  };
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual properties (not stored in database)
  inWishlist?: boolean;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, "Store tagline is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Store owner is required"],
    },
    business_phone_number: {
      type: String,
      required: [true, "Business phone number is required"],
    },
    business_email: {
      type: String,
      required: [true, "Business email is required"],
      lowercase: true,
    },
    full_address: {
      type: String,
      required: [true, "Full address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    serviceable_pincodes: {
      type: [String],
      default: [],
    },
    isPanIndia: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: [
        "physical_product",
        "digital_product",
        "service",
        "restaurant",
        "infomercial",
      ],
      required: [true, "Service type is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "StoreCategory",
      required: [true, "Store category is required"],
    },
    productCategories: {
      type: [Schema.Types.ObjectId],
      ref: "ProductCategory",
      default: [],
    },
    logo: {
      type: String,
      required: [true, "Store logo is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Store cover image is required"],
    },
    mainImage: {
      type: String,
      required: [true, "Store main image is required"],
    },
    allImages: {
      type: [String],
      default: [],
    },
    popularity_index: {
      type: Number,
      default: 0,
    },
    isBrand: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    opensAt: {
      type: String,
      default: "09:00",
    },
    closesAt: {
      type: String,
      default: "18:00",
    },
    is_24_7: {
      type: Boolean,
      default: false,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    wishlistCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0], // [longitude, latitude]
      },
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
storeSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Validate that if isBrand is true, isPanIndia must be true
storeSchema.pre("save", function (next) {
  if (this.isBrand && !this.isPanIndia) {
    this.isPanIndia = true;
  }
  next();
});

// Create text index for search functionality
storeSchema.index({
  name: "text",
  tagline: "text",
  description: "text",
});

// Create geospatial index for location-based queries
storeSchema.index({ location: "2dsphere" });

export const Store = mongoose.model<IStore>("Store", storeSchema);

export default Store;
