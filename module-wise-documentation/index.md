# Dukaan-Pe API Documentation

## Introduction

This document provides a quick reference to all API modules and endpoints available in the Dukaan-Pe backend. For detailed documentation on each endpoint, please refer to the respective module documentation files.

## Base URL

All API endpoints are prefixed with:

```
/api
```

## Modules and Endpoints

### Authentication

[View detailed documentation](./authentication.md)

- `POST /api/auth/request-otp` - Request OTP for mobile number
- `POST /api/auth/verify-otp` - Verify OTP and get access token
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/me` - Update user profile

### Address

[View detailed documentation](./address.md)

- `GET /api/addresses` - Get all addresses for current user
- `POST /api/addresses` - Create a new address
- `GET /api/addresses/:id` - Get a specific address
- `PATCH /api/addresses/:id` - Update an address
- `DELETE /api/addresses/:id` - Delete an address
- `PATCH /api/addresses/:id/set-default` - Set an address as default
- `PATCH /api/addresses/:id/restore` - Restore a deleted address

### Store

[View detailed documentation](./store.md)

- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create a new store
- `GET /api/stores/:id` - Get a specific store
- `PATCH /api/stores/:id` - Update a store
- `DELETE /api/stores/:id` - Delete a store
- `PATCH /api/stores/:id/restore` - Restore a deleted store
- `GET /api/stores/top-selling` - Get top selling stores
- `GET /api/stores/best-rated` - Get best rated stores
- `GET /api/stores/nearby` - Get nearby stores
- `GET /api/stores/search` - Search stores
- `GET /api/stores/search-with-filters` - Search stores with advanced filters

### Store Images

[View detailed documentation](./store-images.md)

- `POST /api/store-images` - Create a new store images collection
- `GET /api/store-images/store/:storeId` - Get all image collections for a store
- `GET /api/store-images/:id` - Get a specific image collection
- `PATCH /api/store-images/:id` - Update an image collection
- `DELETE /api/store-images/:id` - Delete an image collection
- `PATCH /api/store-images/:id/restore` - Restore a deleted image collection

### Store Category

[View detailed documentation](./store-category.md)

- `GET /api/store-categories` - Get all parent store categories
- `GET /api/store-categories/sub` - Get subcategories for a parent category
- `POST /api/store-categories` - Create a new store category
- `GET /api/store-categories/:id` - Get a specific store category
- `PATCH /api/store-categories/:id` - Update a store category
- `DELETE /api/store-categories/:id` - Delete a store category
- `PATCH /api/store-categories/:id/restore` - Restore a deleted store category
- `GET /api/store-categories/:categoryId/stores` - Get stores by category (includes subcategories)

### Product

[View detailed documentation](./product.md)

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a specific product
- `PATCH /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `PATCH /api/products/:id/restore` - Restore a deleted product
- `GET /api/products/top-selling` - Get top selling products
- `GET /api/products/best-rated` - Get best rated products
- `GET /api/products/search` - Search products
- `GET /api/products/search-with-filters` - Search products with advanced filters
- `GET /api/products/store/:storeId` - Get products for a specific store

### Product Category

[View detailed documentation](./product-category.md)

- `GET /api/product-categories` - Get all parent product categories
- `GET /api/product-categories/sub` - Get subcategories for a parent category
- `POST /api/product-categories` - Create a new product category
- `GET /api/product-categories/:id` - Get a specific product category
- `PATCH /api/product-categories/:id` - Update a product category
- `DELETE /api/product-categories/:id` - Delete a product category
- `PATCH /api/product-categories/:id/restore` - Restore a deleted product category
- `GET /api/product-categories/:categoryId/products` - Get products by category (includes subcategories)
- `GET /api/product-categories/:categoryId/stores` - Get stores by product category (includes subcategories)

### Catalogue Product

[View detailed documentation](./catalogue-product.md)

- `GET /api/catalogue-products` - Get all catalogue products
- `POST /api/catalogue-products` - Create a new catalogue product
- `GET /api/catalogue-products/:id` - Get a specific catalogue product
- `PATCH /api/catalogue-products/:id` - Update a catalogue product
- `DELETE /api/catalogue-products/:id` - Delete a catalogue product
- `PATCH /api/catalogue-products/:id/restore` - Restore a deleted catalogue product
- `GET /api/catalogue-products/category/:categoryId` - Get catalogue products by category

### Review

[View detailed documentation](./review.md)

- `GET /api/products/:productId/reviews` - Get all reviews for a product
- `POST /api/products/:productId/reviews` - Create a review for a product
- `GET /api/stores/:storeId/reviews` - Get all reviews for a store
- `POST /api/stores/:storeId/reviews` - Create a review for a store
- `GET /api/users/reviews` - Get current user's reviews

### Wishlist

[View detailed documentation](./wishlist.md)

- `GET /api/product-wishlist` - Get user's product wishlist
- `POST /api/product-wishlist/:productId` - Add product to wishlist
- `DELETE /api/product-wishlist/:productId` - Remove product from wishlist
- `GET /api/product-wishlist/popular` - Get popular wishlisted products
- `GET /api/store-wishlist` - Get user's store wishlist
- `POST /api/store-wishlist/:storeId` - Add store to wishlist
- `DELETE /api/store-wishlist/:storeId` - Remove store from wishlist
- `GET /api/store-wishlist/popular` - Get popular wishlisted stores

### Cart

[View detailed documentation](./cart.md)

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add-item` - Add item to cart
- `PATCH /api/cart/update-item` - Update item in cart
- `DELETE /api/cart/remove-item` - Remove item from cart
- `POST /api/cart/apply-coupon` - Apply coupon to cart
- `DELETE /api/cart/remove-coupon` - Remove coupon from cart

### Order

[View detailed documentation](./order.md)

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders for current user
- `GET /api/orders/:id` - Get a specific order
- `PATCH /api/orders/:id/cancel` - Cancel an order
- `GET /api/stores/:storeId/orders` - Get all orders for a store

### Payment

[View detailed documentation](./payment.md)

- `POST /api/payments/create-razorpay-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment
- `GET /api/payments/order/:orderId` - Get payment details for an order

### Upload

[View detailed documentation](./upload.md)

- `POST /api/upload/image` - Upload an image and get URL

### Pincode

[View detailed documentation](./pincode.md)

- `GET /api/pincode/is-serviceable` - Check if a pincode is serviceable
