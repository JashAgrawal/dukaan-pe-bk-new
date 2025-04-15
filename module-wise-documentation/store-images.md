# Store Images API

The Store Images API allows store owners to manage collections of images for their stores. Each collection has a heading and multiple images.

## Base URL

All API endpoints are prefixed with:

```
/api/store-images
```

## Endpoints

### Create Store Images Collection

```
POST /api/store-images
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "store": "60d21b4667d0d8992e610c86",
  "heading": "Summer Collection 2023",
  "images": [
    "https://example.com/summer1.jpg",
    "https://example.com/summer2.jpg",
    "https://example.com/summer3.jpg"
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "storeImages": {
      "_id": "60d21b4667d0d8992e610c90",
      "store": "60d21b4667d0d8992e610c86",
      "heading": "Summer Collection 2023",
      "images": [
        "https://example.com/summer1.jpg",
        "https://example.com/summer2.jpg",
        "https://example.com/summer3.jpg"
      ],
      "isDeleted": false,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Get All Image Collections for a Store

```
GET /api/store-images/store/:storeId
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
    "storeImagesCollections": [
      {
        "_id": "60d21b4667d0d8992e610c90",
        "store": "60d21b4667d0d8992e610c86",
        "heading": "Summer Collection 2023",
        "images": [
          "https://example.com/summer1.jpg",
          "https://example.com/summer2.jpg",
          "https://example.com/summer3.jpg"
        ],
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c91",
        "store": "60d21b4667d0d8992e610c86",
        "heading": "Winter Collection 2023",
        "images": [
          "https://example.com/winter1.jpg",
          "https://example.com/winter2.jpg",
          "https://example.com/winter3.jpg"
        ],
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Get a Specific Image Collection

```
GET /api/store-images/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "storeImagesCollection": {
      "_id": "60d21b4667d0d8992e610c90",
      "store": "60d21b4667d0d8992e610c86",
      "heading": "Summer Collection 2023",
      "images": [
        "https://example.com/summer1.jpg",
        "https://example.com/summer2.jpg",
        "https://example.com/summer3.jpg"
      ],
      "isDeleted": false,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update an Image Collection

```
PATCH /api/store-images/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "heading": "Updated Summer Collection 2023",
  "images": [
    "https://example.com/summer1.jpg",
    "https://example.com/summer2.jpg",
    "https://example.com/summer3.jpg",
    "https://example.com/summer4.jpg"
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "storeImagesCollection": {
      "_id": "60d21b4667d0d8992e610c90",
      "store": "60d21b4667d0d8992e610c86",
      "heading": "Updated Summer Collection 2023",
      "images": [
        "https://example.com/summer1.jpg",
        "https://example.com/summer2.jpg",
        "https://example.com/summer3.jpg",
        "https://example.com/summer4.jpg"
      ],
      "isDeleted": false,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Delete an Image Collection

```
DELETE /api/store-images/:id
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

### Restore a Deleted Image Collection

```
PATCH /api/store-images/:id/restore
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
    "storeImagesCollection": {
      "_id": "60d21b4667d0d8992e610c90",
      "store": "60d21b4667d0d8992e610c86",
      "heading": "Updated Summer Collection 2023",
      "images": [
        "https://example.com/summer1.jpg",
        "https://example.com/summer2.jpg",
        "https://example.com/summer3.jpg",
        "https://example.com/summer4.jpg"
      ],
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-04T12:00:00.000Z"
    }
  }
}
```
