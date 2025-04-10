# Catalogue Product API

The Catalogue Product API allows administrators to manage generalized product templates that are not specific to any store. They serve as a reference for store-specific products.

## Base URL

All API endpoints are prefixed with:

```
/api/catalogue-products
```

## Endpoints

### Get All Catalogue Products

```
GET /api/catalogue-products
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
    "total": 20,
    "page": 1,
    "pages": 10,
    "limit": 2
  },
  "data": {
    "catalogueProducts": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "description": "Latest smartphone with advanced features",
        "mainImage": "https://example.com/smartphone.jpg",
        "allImages": [
          "https://example.com/smartphone1.jpg",
          "https://example.com/smartphone2.jpg"
        ],
        "type": "physical",
        "price": 50000,
        "sellingPrice": 45000,
        "discountAmount": 5000,
        "discountPercentage": 10,
        "sizeVariants": [],
        "variants": [
          {
            "name": "Color",
            "value": "Black",
            "inventory": 20,
            "sku": "SPX-BLK"
          },
          {
            "name": "Color",
            "value": "White",
            "inventory": 15,
            "sku": "SPX-WHT"
          },
          {
            "name": "Color",
            "value": "Blue",
            "inventory": 10,
            "sku": "SPX-BLU"
          }
        ],
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "popularityIndex": 95,
        "orderCount": 120,
        "reviewCount": 45,
        "averageRating": 4.5,
        "wishlistCount": 78,
        "inventory": 45,
        "tags": ["smartphone", "electronics", "mobile"],
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "description": "High-performance laptop for professionals",
        "mainImage": "https://example.com/laptop.jpg",
        "allImages": [
          "https://example.com/laptop1.jpg",
          "https://example.com/laptop2.jpg"
        ],
        "type": "physical",
        "price": 80000,
        "sellingPrice": 75000,
        "discountAmount": 5000,
        "discountPercentage": 6.25,
        "sizeVariants": [],
        "variants": [
          {
            "name": "Color",
            "value": "Silver",
            "inventory": 20,
            "sku": "LPP-SLV"
          },
          {
            "name": "Color",
            "value": "Space Gray",
            "inventory": 20,
            "sku": "LPP-GRY"
          }
        ],
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "popularityIndex": 90,
        "orderCount": 80,
        "reviewCount": 30,
        "averageRating": 4.7,
        "wishlistCount": 65,
        "inventory": 40,
        "tags": ["laptop", "electronics", "computer"],
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Single Catalogue Product

```
GET /api/catalogue-products/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "catalogueProduct": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Smartphone X",
      "description": "Latest smartphone with advanced features",
      "mainImage": "https://example.com/smartphone.jpg",
      "allImages": [
        "https://example.com/smartphone1.jpg",
        "https://example.com/smartphone2.jpg"
      ],
      "type": "physical",
      "price": 50000,
      "sellingPrice": 45000,
      "discountAmount": 5000,
      "discountPercentage": 10,
      "sizeVariants": [],
      "variants": [
        {
          "name": "Color",
          "value": "Black",
          "inventory": 20,
          "sku": "SPX-BLK"
        },
        {
          "name": "Color",
          "value": "White",
          "inventory": 15,
          "sku": "SPX-WHT"
        },
        {
          "name": "Color",
          "value": "Blue",
          "inventory": 10,
          "sku": "SPX-BLU"
        }
      ],
      "category": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Electronics"
      },
      "popularityIndex": 95,
      "orderCount": 120,
      "reviewCount": 45,
      "averageRating": 4.5,
      "wishlistCount": 78,
      "inventory": 45,
      "tags": ["smartphone", "electronics", "mobile"],
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Create Catalogue Product

```
POST /api/catalogue-products
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Catalogue Product",
  "description": "Detailed product description",
  "mainImage": "https://example.com/newproduct.jpg",
  "allImages": [
    "https://example.com/newproduct1.jpg",
    "https://example.com/newproduct2.jpg"
  ],
  "type": "physical",
  "price": 30000,
  "sellingPrice": 27000,
  "sizeVariants": [],
  "variants": [
    {
      "name": "Color",
      "value": "Red",
      "inventory": 50,
      "sku": "NCP-RED"
    }
  ],
  "category": "60d21b4667d0d8992e610c85",
  "inventory": 100,
  "tags": ["new", "trending"]
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "catalogueProduct": {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "New Catalogue Product",
      "description": "Detailed product description",
      "mainImage": "https://example.com/newproduct.jpg",
      "allImages": [
        "https://example.com/newproduct1.jpg",
        "https://example.com/newproduct2.jpg"
      ],
      "type": "physical",
      "price": 30000,
      "sellingPrice": 27000,
      "discountAmount": 3000,
      "discountPercentage": 10,
      "sizeVariants": [],
      "variants": [
        {
          "name": "Color",
          "value": "Red",
          "inventory": 50,
          "sku": "NCP-RED"
        }
      ],
      "category": "60d21b4667d0d8992e610c85",
      "popularityIndex": 0,
      "orderCount": 0,
      "reviewCount": 0,
      "averageRating": 0,
      "wishlistCount": 0,
      "inventory": 100,
      "tags": ["new", "trending"],
      "createdAt": "2023-01-03T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Update Catalogue Product

```
PATCH /api/catalogue-products/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "description": "Updated product description",
  "sellingPrice": 25000,
  "inventory": 80
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "catalogueProduct": {
      "_id": "60d21b4667d0d8992e610c87",
      "description": "Updated product description",
      "sellingPrice": 25000,
      "discountAmount": 5000,
      "discountPercentage": 16.67,
      "inventory": 80,
      "updatedAt": "2023-01-03T13:00:00.000Z"
    }
  }
}
```

### Delete Catalogue Product

```
DELETE /api/catalogue-products/:id
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

### Restore Catalogue Product

```
PATCH /api/catalogue-products/:id/restore
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
    "catalogueProduct": {
      "_id": "60d21b4667d0d8992e610c87",
      "isDeleted": false,
      "deletedAt": null,
      "updatedAt": "2023-01-03T14:00:00.000Z"
    }
  }
}
```

### Get Catalogue Products by Category

```
GET /api/catalogue-products/category/:categoryId
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
    "total": 2,
    "page": 1,
    "pages": 1,
    "limit": 10
  },
  "data": {
    "catalogueProducts": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "price": 50000,
        "sellingPrice": 45000,
        "discountPercentage": 10,
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
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
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "averageRating": 4.7,
        "reviewCount": 30
      }
    ]
  }
}
```
