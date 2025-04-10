# Product Category API

The Product Category API allows users to browse and manage product categories on the platform. Categories now support a hierarchical structure with parent and subcategories.

## Base URL

All API endpoints are prefixed with:

```
/api/product-categories
```

## Endpoints

### Get All Parent Product Categories

```
GET /api/product-categories
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 20)

**Response:**

This endpoint now returns only parent categories (categories with no parentId).

```json
{
  "status": "success",
  "results": 5,
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 3,
    "limit": 5
  },
  "data": {
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Electronics",
        "parentId": null,
        "image": "https://example.com/electronics.jpg",
        "popularityIndex": 95,
        "noOfProducts": 120,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Fashion",
        "parentId": null,
        "image": "https://example.com/fashion.jpg",
        "popularityIndex": 90,
        "noOfProducts": 200,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Subcategories for a Parent Category

```
GET /api/product-categories/sub
```

**Query Parameters:**

- `parentCategoryId` (required): ID of the parent category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 20)

**Response:**

```json
{
  "status": "success",
  "results": 3,
  "pagination": {
    "total": 3,
    "page": 1,
    "pages": 1,
    "limit": 20
  },
  "data": {
    "subcategories": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Smartphones",
        "parentId": "60d21b4667d0d8992e610c85",
        "image": "https://example.com/smartphones.jpg",
        "popularityIndex": 90,
        "noOfProducts": 45,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c88",
        "name": "Laptops",
        "parentId": "60d21b4667d0d8992e610c85",
        "image": "https://example.com/laptops.jpg",
        "popularityIndex": 85,
        "noOfProducts": 35,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c89",
        "name": "Tablets",
        "parentId": "60d21b4667d0d8992e610c85",
        "image": "https://example.com/tablets.jpg",
        "popularityIndex": 80,
        "noOfProducts": 25,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Products by Product Category

```
GET /api/product-categories/:categoryId/products
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Note:** This endpoint now returns products from both the specified category and all its subcategories.

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 8,
    "limit": 2
  },
  "data": {
    "products": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "sellingPrice": 45000,
        "category": {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Smartphones"
        },
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        },
        "averageRating": 4.5,
        "reviewCount": 45
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "mainImage": "https://example.com/laptop.jpg",
        "sellingPrice": 75000,
        "category": {
          "_id": "60d21b4667d0d8992e610c88",
          "name": "Laptops"
        },
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        },
        "averageRating": 4.7,
        "reviewCount": 30
      }
    ]
  }
}
```

### Get Stores by Product Category

```
GET /api/product-categories/:categoryId/stores
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Note:** This endpoint returns stores from both the specified product category and all its subcategories.

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 8,
    "page": 1,
    "pages": 4,
    "limit": 2
  },
  "data": {
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "productCategories": [
          {
            "_id": "60d21b4667d0d8992e610c87",
            "name": "Smartphones"
          }
        ],
        "averageRating": 4.7,
        "reviewCount": 65
      },
      {
        "_id": "60d21b4667d0d8992e610c88",
        "name": "Laptop World",
        "logo": "https://example.com/logo3.jpg",
        "mainImage": "https://example.com/main3.jpg",
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "productCategories": [
          {
            "_id": "60d21b4667d0d8992e610c88",
            "name": "Laptops"
          }
        ],
        "averageRating": 4.6,
        "reviewCount": 52
      }
    ]
  }
}
```

### Create Product Category

```
POST /api/product-categories
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Product Category",
  "parentId": "60d21b4667d0d8992e610c85",
  "image": "https://example.com/new-category.jpg"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "New Product Category",
      "parentId": "60d21b4667d0d8992e610c85",
      "image": "https://example.com/new-category.jpg",
      "popularityIndex": 0,
      "noOfProducts": 0,
      "createdAt": "2023-01-03T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Get Single Product Category

```
GET /api/product-categories/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Electronics",
      "parentId": null,
      "image": "https://example.com/electronics.jpg",
      "popularityIndex": 95,
      "noOfProducts": 120,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update Product Category

```
PATCH /api/product-categories/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Updated Product Category",
  "image": "https://example.com/updated-category.jpg"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Updated Product Category",
      "image": "https://example.com/updated-category.jpg",
      "updatedAt": "2023-01-03T13:00:00.000Z"
    }
  }
}
```

### Delete Product Category

```
DELETE /api/product-categories/:id
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

### Restore Product Category

```
PATCH /api/product-categories/:id/restore
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
    "category": {
      "_id": "60d21b4667d0d8992e610c85",
      "isDeleted": false,
      "deletedAt": null,
      "updatedAt": "2023-01-03T14:00:00.000Z"
    }
  }
}
```
