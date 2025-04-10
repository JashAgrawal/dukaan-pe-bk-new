# Wishlist API

The Wishlist API allows users to manage their product and store wishlists.

## Base URL

All API endpoints are prefixed with:

```
/api
```

## Product Wishlist Endpoints

### Get User's Product Wishlist

```
GET /api/product-wishlist
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 3,
    "limit": 2
  },
  "data": {
    "wishlist": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "user": "60d21b4667d0d8992e610c85",
        "product": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Smartphone X",
          "mainImage": "https://example.com/smartphone.jpg",
          "price": 50000,
          "sellingPrice": 45000,
          "discountPercentage": 10,
          "store": {
            "_id": "60d21b4667d0d8992e610c86",
            "name": "Electronics Hub"
          },
          "averageRating": 4.5,
          "reviewCount": 45
        },
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "user": "60d21b4667d0d8992e610c85",
        "product": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Laptop Pro",
          "mainImage": "https://example.com/laptop.jpg",
          "price": 80000,
          "sellingPrice": 75000,
          "discountPercentage": 6.25,
          "store": {
            "_id": "60d21b4667d0d8992e610c86",
            "name": "Electronics Hub"
          },
          "averageRating": 4.7,
          "reviewCount": 30
        },
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Add Product to Wishlist

```
POST /api/product-wishlist/:productId
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "wishlist": {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "product": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Remove Product from Wishlist

```
DELETE /api/product-wishlist/:productId
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

### Get Popular Wishlisted Products

```
GET /api/product-wishlist/popular
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "products": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "price": 50000,
        "sellingPrice": 45000,
        "discountPercentage": 10,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        },
        "wishlistCount": 78,
        "averageRating": 4.5,
        "reviewCount": 45
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "mainImage": "https://example.com/laptop.jpg",
        "price": 80000,
        "sellingPrice": 75000,
        "discountPercentage": 6.25,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        },
        "wishlistCount": 65,
        "averageRating": 4.7,
        "reviewCount": 30
      }
    ]
  }
}
```

## Store Wishlist Endpoints

### Get User's Store Wishlist

```
GET /api/store-wishlist
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 3,
    "page": 1,
    "pages": 2,
    "limit": 2
  },
  "data": {
    "wishlist": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "user": "60d21b4667d0d8992e610c85",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg",
          "mainImage": "https://example.com/main2.jpg",
          "tagline": "Best Electronics Deals",
          "averageRating": 4.7,
          "reviewCount": 65
        },
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c88",
        "user": "60d21b4667d0d8992e610c85",
        "store": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Fashion Store",
          "logo": "https://example.com/logo.jpg",
          "mainImage": "https://example.com/main.jpg",
          "tagline": "Latest Fashion Trends",
          "averageRating": 4.5,
          "reviewCount": 45
        },
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Add Store to Wishlist

```
POST /api/store-wishlist/:storeId
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "wishlist": {
      "_id": "60d21b4667d0d8992e610c87",
      "user": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c86",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Remove Store from Wishlist

```
DELETE /api/store-wishlist/:storeId
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

### Get Popular Wishlisted Stores

```
GET /api/store-wishlist/popular
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "tagline": "Best Electronics Deals",
        "wishlistCount": 120,
        "averageRating": 4.7,
        "reviewCount": 65
      },
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "tagline": "Latest Fashion Trends",
        "wishlistCount": 95,
        "averageRating": 4.5,
        "reviewCount": 45
      }
    ]
  }
}
```
