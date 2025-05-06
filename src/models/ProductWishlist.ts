import mongoose, { Document, Schema } from "mongoose";
import { Product } from "./Product";

export interface IProductWishlist extends Document {
  product: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  store: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productWishlistSchema = new Schema<IProductWishlist>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
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
productWishlistSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Prevent duplicate wishlist entries (one user can only wishlist a product once per store)
productWishlistSchema.index({ product: 1, user: 1, store: 1 }, { unique: true });

// Update product's wishlist count when an item is added to wishlist
productWishlistSchema.post("save", async function () {
  const productId = this.product;

  // Count total wishlist entries for this product
  const count = await this.model("ProductWishlist").countDocuments({
    product: productId,
    isDeleted: false
  });

  // Update product with new wishlist count
  await Product.findByIdAndUpdate(productId, {
    wishlistCount: count
  });
});

// Also update product wishlist count when an item is removed from wishlist
productWishlistSchema.post(/^findOneAndUpdate/, async function (doc) {
  if (doc) {
    const productId = doc.product;

    // Count total wishlist entries for this product
    const count = await mongoose.model("ProductWishlist").countDocuments({
      product: productId,
      isDeleted: false
    });

    // Update product with new wishlist count
    await Product.findByIdAndUpdate(productId, {
      wishlistCount: count
    });
  }
});

export const ProductWishlist = mongoose.model<IProductWishlist>(
  "ProductWishlist",
  productWishlistSchema
);

export default ProductWishlist;
