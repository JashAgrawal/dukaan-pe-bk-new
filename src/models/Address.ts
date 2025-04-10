import mongoose, { Document, Schema, Query } from "mongoose";

export interface IAddress extends Document {
  user: Schema.Types.ObjectId;
  location: {
    type: string;
    coordinates: number[];
  };
  country: string;
  state: string;
  city: string;
  pincode: string;
  houseDetails: string;
  streetAddress: string;
  directionToReach?: string;
  googleFetchedAddress: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: [true, "Coordinates are required"],
      },
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^[0-9]{6}$/, "Pincode must be 6 digits"],
    },
    houseDetails: {
      type: String,
      required: [true, "House details are required"],
    },
    streetAddress: {
      type: String,
      required: [true, "Street address is required"],
    },
    directionToReach: {
      type: String,
    },
    googleFetchedAddress: {
      type: String,
      required: [true, "Google fetched address is required"],
    },
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    isDefault: {
      type: Boolean,
      default: false,
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

// Create a geospatial index on the location field
addressSchema.index({ location: "2dsphere" });

// Add middleware to exclude soft-deleted documents by default
addressSchema.pre(/^find/, function (this: Query<any, any>) {
  // @ts-ignore
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  // @ts-ignore
  delete this.getQuery().includeSoftDeleted;
});

// Ensure only one default address per user (excluding deleted ones)
addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.model("Address").updateMany(
      {
        user: this.user,
        _id: { $ne: this._id },
        isDeleted: false,
      },
      { isDefault: false }
    );
  }
  next();
});

export const Address = mongoose.model<IAddress>("Address", addressSchema);

export default Address;
