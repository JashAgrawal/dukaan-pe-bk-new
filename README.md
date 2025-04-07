# Dukaan-Pe Backend

A scalable MongoDB, Express, TypeScript backend application.

## Features

- TypeScript for type safety
- MongoDB with Mongoose for data storage
- Express for API routing
- JWT authentication
- Role-based access control
- Error handling middleware
- Request validation with Joi
- Logging system
- Environment configuration

## E-commerce Features

### Offer Management

- Store owners can create offers with percentage or amount-based discounts
- Each product can only be in one offer at a time
- Per store, only 2 offers can be active at a time

### Coupon Management

- Store owners can create coupons with unique codes
- Coupons can provide percentage or amount-based discounts
- Coupons can be applied to specific products or the entire store

### Cart Management

- Users can add products to their cart
- Apply coupons and offers to get discounts
- Cart items include detailed price breakdown (original price, discounts, effective price)
- Cart state management (active, buy-now, pending, consumed, cancelled)

### Enhanced Product and Store APIs

- Product listing APIs include `inWishlist` and `quantityInCart` fields for buyers
- Store listing APIs include `inWishlist` field for buyers

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Custom middleware functions
│   ├── models/         # MongoDB schema models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── validators/     # Request validation schemas
│   └── app.ts          # Application entry point
├── tests/              # Test files
├── logs/               # Application logs
├── dist/               # Compiled JavaScript code
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile (protected)

### Offer Management

- `POST /api/offers` - Create a new offer (protected, store owner only)
- `GET /api/offers` - Get all offers for a store (protected, store owner only)
- `GET /api/offers/:id` - Get a single offer (protected, store owner only)
- `PATCH /api/offers/:id` - Update an offer (protected, store owner only)
- `DELETE /api/offers/:id` - Delete an offer (protected, store owner only)

### Coupon Management

- `POST /api/coupons` - Create a new coupon (protected, store owner only)
- `GET /api/coupons` - Get all coupons for a store (protected, store owner only)
- `GET /api/coupons/:id` - Get a single coupon (protected, store owner only)
- `PATCH /api/coupons/:id` - Update a coupon (protected, store owner only)
- `DELETE /api/coupons/:id` - Delete a coupon (protected, store owner only)
- `GET /api/coupons/validate/:code` - Validate a coupon code (public)

### Cart Management

- `POST /api/cart/add-item` - Add item to cart (protected)
- `DELETE /api/cart/remove-item/:productId` - Remove item from cart (protected)
- `PATCH /api/cart/update-quantity/:productId` - Update product quantity in cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)
- `POST /api/cart/apply-coupon` - Apply coupon to cart (protected)
- `POST /api/cart/apply-offer` - Apply offer to cart (protected)
- `DELETE /api/cart/remove-coupon` - Remove coupon from cart (protected)
- `DELETE /api/cart/remove-offer` - Remove offer from cart (protected)
- `GET /api/cart` - Get user's cart (protected)
- `GET /api/cart/count` - Get cart item count (protected)
- `GET /api/cart/check/:productId` - Check if product is in cart and get quantity (protected)

## License

ISC
