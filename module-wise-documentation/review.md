# Review API

The Review API allows users to create and view reviews for products and stores.

## Base URL

All API endpoints are prefixed with:

```
/api
```

## Endpoints

### Get All Product Reviews

```
GET /api/products/:productId/reviews
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `sort` (optional): Sort field (default: -createdAt)

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 23,
    "limit": 2
  },
  "data": {
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "rating": 5,
        "review": "Excellent product, very satisfied with the purchase.",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe"
        },
        "product": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "rating": 4,
        "review": "Good product, but could be better.",
        "user": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Jane Smith"
        },
        "product": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Create Product Review

```
POST /api/products/:productId/reviews
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rating": 5,
  "review": "Excellent product, very satisfied with the purchase."
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "60d21b4667d0d8992e610c85",
      "rating": 5,
      "review": "Excellent product, very satisfied with the purchase.",
      "user": "60d21b4667d0d8992e610c85",
      "product": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Get All Store Reviews

```
GET /api/stores/:storeId/reviews
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `sort` (optional): Sort field (default: -createdAt)

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 65,
    "page": 1,
    "pages": 33,
    "limit": 2
  },
  "data": {
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "rating": 5,
        "review": "Great store with excellent customer service.",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe"
        },
        "store": "60d21b4667d0d8992e610c86",
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c88",
        "rating": 4,
        "review": "Good store, but delivery was a bit delayed.",
        "user": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Jane Smith"
        },
        "store": "60d21b4667d0d8992e610c86",
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Create Store Review

```
POST /api/stores/:storeId/reviews
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rating": 5,
  "review": "Great store with excellent customer service."
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "60d21b4667d0d8992e610c87",
      "rating": 5,
      "review": "Great store with excellent customer service.",
      "user": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c86",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Get User's Reviews

```
GET /api/users/reviews
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `sort` (optional): Sort field (default: -createdAt)

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
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "rating": 5,
        "review": "Excellent product, very satisfied with the purchase.",
        "user": "60d21b4667d0d8992e610c85",
        "product": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Smartphone X",
          "mainImage": "https://example.com/smartphone.jpg"
        },
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c87",
        "rating": 5,
        "review": "Great store with excellent customer service.",
        "user": "60d21b4667d0d8992e610c85",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        },
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
}
```
