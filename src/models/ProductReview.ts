import mongoose, { Document, Schema } from "mongoose";
import { Product } from "./Product";

export interface IProductReview extends Document {
  product: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  rating: number;
  review: string;
  images: string[];
  tags: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productReviewSchema = new Schema<IProductReview>(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
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
productReviewSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Prevent duplicate reviews (one user can only review a product once)
productReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product's average rating and review count when a review is added or updated
productReviewSchema.post("save", async function () {
  const productId = this.product;

  // Calculate new average rating
  const stats = await this.model("ProductReview").aggregate([
    {
      $match: { product: productId, isDeleted: false },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Update product with new stats
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating,
      reviewCount: stats[0].count,
    });
  } else {
    // If no reviews, reset to default values
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
});

// Also update product stats when a review is deleted
productReviewSchema.post(/^findOneAndUpdate/, async function (doc) {
  if (doc && doc.isDeleted) {
    const productId = doc.product;

    // Calculate new average rating excluding deleted reviews
    const stats = await mongoose.model("ProductReview").aggregate([
      {
        $match: { product: productId, isDeleted: false },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Update product with new stats
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: stats[0].avgRating,
        reviewCount: stats[0].count,
      });
    } else {
      // If no reviews, reset to default values
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        reviewCount: 0,
      });
    }
  }
});

export const ProductReview = mongoose.model<IProductReview>(
  "ProductReview",
  productReviewSchema
);

export default ProductReview;
