import mongoose, { Document, Schema } from "mongoose";
import { Store } from "./Store";

export interface IStoreWishlist extends Document {
  store: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const storeWishlistSchema = new Schema<IStoreWishlist>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
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
storeWishlistSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Prevent duplicate wishlist entries (one user can only wishlist a store once)
storeWishlistSchema.index({ store: 1, user: 1 }, { unique: true });

// Update store's wishlist count when an item is added to wishlist
storeWishlistSchema.post("save", async function () {
  const storeId = this.store;
  
  // Count total wishlist entries for this store
  const count = await this.model("StoreWishlist").countDocuments({
    store: storeId,
    isDeleted: false
  });
  
  // Update store with new wishlist count
  await Store.findByIdAndUpdate(storeId, {
    wishlistCount: count
  });
});

// Also update store wishlist count when an item is removed from wishlist
storeWishlistSchema.post(/^findOneAndUpdate/, async function (doc) {
  if (doc) {
    const storeId = doc.store;
    
    // Count total wishlist entries for this store
    const count = await mongoose.model("StoreWishlist").countDocuments({
      store: storeId,
      isDeleted: false
    });
    
    // Update store with new wishlist count
    await Store.findByIdAndUpdate(storeId, {
      wishlistCount: count
    });
  }
});

export const StoreWishlist = mongoose.model<IStoreWishlist>(
  "StoreWishlist",
  storeWishlistSchema
);

export default StoreWishlist;
