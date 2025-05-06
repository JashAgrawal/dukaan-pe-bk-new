# Coupon API

The Coupon API allows users to create, manage, and apply coupons to their carts. Coupons can be applied to all products in a store or specific products only. They can provide either a fixed amount discount or a percentage discount with an optional maximum limit.

## Coupon Model

The coupon model has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier for the coupon |
| `store` | ObjectId | Reference to the store that created the coupon |
| `code` | String | Unique coupon code (e.g., "WELCOME10") |
| `type` | String | Type of discount: "amount" or "percentage" |
| `discountAmt` | Number | Fixed amount discount (used when type is "amount") |
| `discountPercentage` | Number | Percentage discount (used when type is "percentage") |
| `maxDiscount` | Number | Maximum discount amount (for percentage discounts) |
| `isActive` | Boolean | Whether the coupon is currently active |
| `products` | [ObjectId] | Array of product IDs the coupon applies to (empty means all products) |
| `isDeleted` | Boolean | Soft delete flag |
| `createdAt` | Date | When the coupon was created |
| `updatedAt` | Date | When the coupon was last updated |

## Base URL

All API endpoints are prefixed with:

```
/api/coupons
```

## Error Responses

The API may return the following error responses:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Something went wrong on the server |

Example error response:

```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "status": "fail",
    "message": "Invalid coupon code"
  }
}
```

## Endpoints

### Get Available Coupons

Fetches all available coupons for a store. If a cart ID is provided, it will only return coupons that are applicable to the items in the cart.

This endpoint is useful for showing users which coupons they can apply to their current cart.

```
GET /api/coupons/available
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `storeId` (required): The ID of the store
- `cartId` (optional): The ID of the cart to check coupon applicability

**Response:**

```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "code": "WELCOME10",
        "type": "percentage",
        "discountAmt": 0,
        "discountPercentage": 10,
        "maxDiscount": 500,
        "products": []
      },
      {
        "id": "60d21b4667d0d8992e610c86",
        "code": "FLAT100",
        "type": "amount",
        "discountAmt": 100,
        "discountPercentage": 0,
        "maxDiscount": 0,
        "products": [
          {
            "_id": "60d21b4667d0d8992e610c87",
            "name": "Smartphone X",
            "mainImage": "https://example.com/smartphone.jpg",
            "price": 45000,
            "sellingPrice": 40000
          }
        ]
      }
    ]
  }
}
```

### Validate Coupon for Cart

Validates a coupon code for a specific store and cart. If a cart ID is provided, it will check if the coupon is applicable to the items in the cart and calculate the discount amount.

This endpoint performs the following validations:
1. Checks if the coupon code exists and is active for the specified store
2. Verifies if the coupon is applicable to the items in the cart
3. Calculates the discount amount for each item in the cart
4. Returns detailed information about the discount breakdown

For percentage-based coupons, the discount is calculated as: `(item price * discount percentage) / 100`, limited by the `maxDiscount` value if specified.
For amount-based coupons, the discount is the fixed `discountAmt` value.

```
POST /api/coupons/validate
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "couponCode": "WELCOME10",
  "storeId": "60d21b4667d0d8992e610c85",
  "cartId": "60d21b4667d0d8992e610c86"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "coupon": {
      "id": "60d21b4667d0d8992e610c85",
      "code": "WELCOME10",
      "type": "percentage",
      "discountAmt": 0,
      "discountPercentage": 10,
      "maxDiscount": 500,
      "products": []
    },
    "totalDiscount": 450,
    "discountDetails": [
      {
        "product": {
          "id": "60d21b4667d0d8992e610c87",
          "name": "Smartphone X",
          "price": 45000,
          "sellingPrice": 40000
        },
        "quantity": 2,
        "discount": 450
      }
    ]
  }
}
```

### Validate Coupon Code (Public)

Validates a coupon code for a specific store without checking cart applicability.

```
GET /api/coupons/validate/:code
```

**Query Parameters:**

- `store` (required): The ID of the store

**Response:**

```json
{
  "status": "success",
  "data": {
    "valid": true,
    "coupon": {
      "id": "60d21b4667d0d8992e610c85",
      "code": "WELCOME10",
      "type": "percentage",
      "discountAmt": 0,
      "discountPercentage": 10,
      "maxDiscount": 500,
      "products": []
    }
  }
}
```

### Create Coupon (Admin)

Creates a new coupon.

```
POST /api/coupons
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "store": "60d21b4667d0d8992e610c85",
  "code": "WELCOME10",
  "type": "percentage",
  "discountPercentage": 10,
  "maxDiscount": 500,
  "isActive": true,
  "products": []
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "coupon": {
      "_id": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c85",
      "code": "WELCOME10",
      "type": "percentage",
      "discountAmt": 0,
      "discountPercentage": 10,
      "maxDiscount": 500,
      "isActive": true,
      "products": [],
      "createdAt": "2023-06-15T12:00:00.000Z",
      "updatedAt": "2023-06-15T12:00:00.000Z"
    }
  }
}
```

### Get All Coupons (Admin)

Fetches all coupons for a store.

```
GET /api/coupons
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `store` (optional): Filter by store ID
- `isActive` (optional): Filter by active status (true/false)

**Response:**

```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "store": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics Hub"
        },
        "code": "WELCOME10",
        "type": "percentage",
        "discountAmt": 0,
        "discountPercentage": 10,
        "maxDiscount": 500,
        "isActive": true,
        "products": [],
        "createdAt": "2023-06-15T12:00:00.000Z",
        "updatedAt": "2023-06-15T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Single Coupon (Admin)

Fetches a single coupon by ID.

```
GET /api/coupons/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "coupon": {
      "_id": "60d21b4667d0d8992e610c85",
      "store": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Electronics Hub"
      },
      "code": "WELCOME10",
      "type": "percentage",
      "discountAmt": 0,
      "discountPercentage": 10,
      "maxDiscount": 500,
      "isActive": true,
      "products": [],
      "createdAt": "2023-06-15T12:00:00.000Z",
      "updatedAt": "2023-06-15T12:00:00.000Z"
    }
  }
}
```

### Update Coupon (Admin)

Updates a coupon by ID.

```
PATCH /api/coupons/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "code": "WELCOME20",
  "discountPercentage": 20,
  "maxDiscount": 1000,
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "coupon": {
      "_id": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c85",
      "code": "WELCOME20",
      "type": "percentage",
      "discountAmt": 0,
      "discountPercentage": 20,
      "maxDiscount": 1000,
      "isActive": true,
      "products": [],
      "createdAt": "2023-06-15T12:00:00.000Z",
      "updatedAt": "2023-06-15T14:00:00.000Z"
    }
  }
}
```

### Delete Coupon (Admin)

Deletes a coupon by ID.

```
DELETE /api/coupons/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": null
}
```

## Applying Coupons to a Cart

To apply a coupon to a cart, you should follow these steps:

1. **Fetch Available Coupons**: Use the `GET /api/coupons/available` endpoint to show users which coupons they can apply to their cart.

2. **Validate the Selected Coupon**: When a user selects a coupon, use the `POST /api/coupons/validate` endpoint to validate it and get the discount amount.

3. **Apply the Coupon to the Cart**: Use the Cart API's apply coupon endpoint to actually apply the coupon to the cart:

```
POST /api/carts/:cartId/apply-coupon
```

Request body:
```json
{
  "couponCode": "WELCOME10"
}
```

4. **Create Order with Coupon**: When creating an order from the cart, the coupon discount will be automatically applied.

## Error Handling

Common errors when working with coupons:

1. **Invalid Coupon Code**: The coupon code doesn't exist or is inactive.
2. **Coupon Not Applicable**: The coupon is not applicable to the items in the cart.
3. **Store Mismatch**: The coupon belongs to a different store than the cart.

Always validate coupons before applying them to ensure a smooth user experience.
