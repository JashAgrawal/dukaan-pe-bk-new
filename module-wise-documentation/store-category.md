# Store Category API

The Store Category API allows users to browse and manage store categories on the platform. Categories now support a hierarchical structure with parent and subcategories.

## Base URL

All API endpoints are prefixed with:

```
/api/store-categories
```

## Endpoints

### Get All Parent Store Categories

```
GET /api/store-categories
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 20)

**Response:**

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
        "name": "Electronics Stores",
        "parentId": null,
        "image": "https://example.com/electronics-stores.jpg",
        "popularityIndex": 95,
        "noOfStores": 50,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Fashion Stores",
        "parentId": null,
        "image": "https://example.com/fashion-stores.jpg",
        "popularityIndex": 90,
        "noOfStores": 80,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Subcategories for a Parent Category

```
GET /api/store-categories/sub
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
        "name": "Men's Clothing Stores",
        "parentId": "60d21b4667d0d8992e610c86",
        "image": "https://example.com/mens-clothing.jpg",
        "popularityIndex": 85,
        "noOfStores": 30,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c88",
        "name": "Women's Clothing Stores",
        "parentId": "60d21b4667d0d8992e610c86",
        "image": "https://example.com/womens-clothing.jpg",
        "popularityIndex": 88,
        "noOfStores": 35,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c89",
        "name": "Footwear Stores",
        "parentId": "60d21b4667d0d8992e610c86",
        "image": "https://example.com/footwear.jpg",
        "popularityIndex": 80,
        "noOfStores": 25,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Create Store Category

```
POST /api/store-categories
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Store Category",
  "parentId": "60d21b4667d0d8992e610c86",
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
      "name": "New Store Category",
      "parentId": "60d21b4667d0d8992e610c86",
      "image": "https://example.com/new-category.jpg",
      "popularityIndex": 0,
      "noOfStores": 0,
      "createdAt": "2023-01-03T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Get Single Store Category

```
GET /api/store-categories/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Fashion Stores",
      "parentId": null,
      "image": "https://example.com/fashion-stores.jpg",
      "popularityIndex": 90,
      "noOfStores": 80,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update Store Category

```
PATCH /api/store-categories/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Updated Store Category",
  "image": "https://example.com/updated-category.jpg"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Updated Store Category",
      "image": "https://example.com/updated-category.jpg",
      "updatedAt": "2023-01-03T13:00:00.000Z"
    }
  }
}
```

### Delete Store Category

```
DELETE /api/store-categories/:id
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

### Restore Store Category

```
PATCH /api/store-categories/:id/restore
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
      "_id": "60d21b4667d0d8992e610c86",
      "isDeleted": false,
      "deletedAt": null,
      "updatedAt": "2023-01-03T14:00:00.000Z"
    }
  }
}
```

### Get Stores by Store Category

```
GET /api/store-categories/:categoryId/stores
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Note:** This endpoint returns stores from both the specified category and all its subcategories.

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 12,
    "page": 1,
    "pages": 6,
    "limit": 2
  },
  "data": {
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "category": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Fashion"
        },
        "averageRating": 4.5,
        "reviewCount": 45
      },
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Men's Fashion",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "category": {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Men's Clothing Stores"
        },
        "averageRating": 4.3,
        "reviewCount": 38
      }
    ]
  }
}
```
