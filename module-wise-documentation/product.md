# Product API

The Product API allows users to browse, search, and manage products on the platform.

## Base URL

All API endpoints are prefixed with:

```
/api/products
```

## Endpoints

### Get All Products

```
GET /api/products
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
    "total": 50,
    "page": 1,
    "pages": 25,
    "limit": 2
  },
  "data": {
    "products": [
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
            "options": ["Black", "White", "Blue"]
          },
          {
            "name": "Storage",
            "options": ["64GB", "128GB", "256GB"]
          }
        ],
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "store_id": "60d21b4667d0d8992e610c86",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        },
        "popularityIndex": 95,
        "orderCount": 120,
        "reviewCount": 45,
        "averageRating": 4.5,
        "wishlistCount": 78,
        "inventory": 50,
        "tags": ["smartphone", "electronics", "mobile"],
        "inWishlist": false,
        "quantityInCart": 0,
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
            "options": ["Silver", "Space Gray"]
          },
          {
            "name": "RAM",
            "options": ["8GB", "16GB"]
          },
          {
            "name": "Storage",
            "options": ["256GB", "512GB", "1TB"]
          }
        ],
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "store_id": "60d21b4667d0d8992e610c86",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        },
        "popularityIndex": 90,
        "orderCount": 80,
        "reviewCount": 30,
        "averageRating": 4.7,
        "wishlistCount": 65,
        "inventory": 25,
        "tags": ["laptop", "electronics", "computer"],
        "inWishlist": false,
        "quantityInCart": 0,
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Single Product

```
GET /api/products/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "product": {
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
          "options": ["Black", "White", "Blue"]
        },
        {
          "name": "Storage",
          "options": ["64GB", "128GB", "256GB"]
        }
      ],
      "category": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Electronics"
      },
      "store_id": "60d21b4667d0d8992e610c86",
      "store": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "averageRating": 4.7,
        "reviewCount": 65
      },
      "popularityIndex": 95,
      "orderCount": 120,
      "reviewCount": 45,
      "averageRating": 4.5,
      "wishlistCount": 78,
      "inventory": 50,
      "tags": ["smartphone", "electronics", "mobile"],
      "inWishlist": false,
      "quantityInCart": 0,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    },
    "relatedProducts": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "price": 50000,
        "sellingPrice": 45000,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        }
      }
    ]
  }
}
```

### Create Product

```
POST /api/products
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Product",
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
      "options": ["Red", "Green"]
    }
  ],
  "category": "60d21b4667d0d8992e610c85",
  "store": "60d21b4667d0d8992e610c86",
  "inventory": 100,
  "tags": ["new", "trending"]
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "product": {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "New Product",
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
          "options": ["Red", "Green"]
        }
      ],
      "category": "60d21b4667d0d8992e610c85",
      "store_id": "60d21b4667d0d8992e610c86",
      "store": "60d21b4667d0d8992e610c86",
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

### Update Product

```
PATCH /api/products/:id
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
    "product": {
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

### Delete Product

```
DELETE /api/products/:id
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

### Restore Product

```
PATCH /api/products/:id/restore
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
    "product": {
      "_id": "60d21b4667d0d8992e610c87",
      "isDeleted": false,
      "deletedAt": null,
      "updatedAt": "2023-01-03T14:00:00.000Z"
    }
  }
}
```

### Get Top Selling Products

```
GET /api/products/top-selling
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
        "orderCount": 120,
        "averageRating": 4.5,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        }
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "mainImage": "https://example.com/laptop.jpg",
        "price": 80000,
        "sellingPrice": 75000,
        "orderCount": 80,
        "averageRating": 4.7,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        }
      }
    ]
  }
}
```

### Get Best Rated Products

```
GET /api/products/best-rated
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
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "mainImage": "https://example.com/laptop.jpg",
        "price": 80000,
        "sellingPrice": 75000,
        "averageRating": 4.7,
        "reviewCount": 30,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        }
      },
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "price": 50000,
        "sellingPrice": 45000,
        "averageRating": 4.5,
        "reviewCount": 45,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        }
      }
    ]
  }
}
```

### Search Products

```
GET /api/products/search
```

**Query Parameters:**

- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 1,
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1,
    "limit": 10
  },
  "data": {
    "products": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "sellingPrice": 45000,
        "averageRating": 4.5,
        "reviewCount": 45,
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub"
        }
      }
    ]
  }
}
```

### Search Products with Filters

```
GET /api/products/search-with-filters
```

**Query Parameters:**

- `query` (optional): Search query for text search
- `categoryIds` (optional): Comma-separated list of category IDs (includes subcategories automatically)
- `tags` (optional): Comma-separated list of tags
- `type` (optional): Product type filter
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `sortBy` (optional): Sort results by (popularity, price-low-to-high, price-high-to-low, discount, avgRating)
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
    "products": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "sellingPrice": 45000,
        "price": 50000,
        "discountPercentage": 10,
        "category": {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Smartphones"
        },
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        },
        "averageRating": 4.5,
        "reviewCount": 45,
        "tags": ["smartphone", "electronics", "mobile"],
        "type": "physical",
        "popularityIndex": 85
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "mainImage": "https://example.com/laptop.jpg",
        "sellingPrice": 75000,
        "price": 85000,
        "discountPercentage": 12,
        "category": {
          "_id": "60d21b4667d0d8992e610c88",
          "name": "Laptops"
        },
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        },
        "averageRating": 4.7,
        "reviewCount": 35,
        "tags": ["laptop", "electronics", "computer"],
        "type": "physical",
        "popularityIndex": 80
      }
    ]
  }
}
```

### Get Products by Store

```
GET /api/products/store/:storeId
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
    "products": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Smartphone X",
        "mainImage": "https://example.com/smartphone.jpg",
        "price": 50000,
        "sellingPrice": 45000,
        "discountPercentage": 10,
        "averageRating": 4.5,
        "reviewCount": 45,
        "wishlistCount": 78
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Laptop Pro",
        "mainImage": "https://example.com/laptop.jpg",
        "price": 80000,
        "sellingPrice": 75000,
        "discountPercentage": 6.25,
        "averageRating": 4.7,
        "reviewCount": 30,
        "wishlistCount": 65
      }
    ]
  }
}
```
