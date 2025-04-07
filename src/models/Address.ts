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
    // ... existing fields ...
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
addressSchema.pre(/^find/, function(this: Query<any, any>) {
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
        isDeleted: false 
      },
      { isDefault: false }
    );
  }
  next();
});

export const Address = mongoose.model<IAddress>("Address", addressSchema);

export default Address;