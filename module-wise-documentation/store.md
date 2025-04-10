# Store API

The Store API allows users to browse, search, and manage stores on the platform.

## Base URL

All API endpoints are prefixed with:

```
/api/stores
```

## Endpoints

### Get All Stores

```
GET /api/stores
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
    "total": 20,
    "page": 1,
    "pages": 10,
    "limit": 2
  },
  "data": {
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "tagline": "Latest Fashion Trends",
        "description": "A store for all your fashion needs",
        "owner_id": "60d21b4667d0d8992e610c85",
        "business_phone_number": "+919876543210",
        "business_email": "contact@fashionstore.com",
        "full_address": "MG Road, Mumbai, Maharashtra 400001, India",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "serviceable_pincodes": ["400001", "400002", "400003"],
        "isPanIndia": false,
        "type": "retail",
        "category": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Fashion"
        },
        "productCategories": [
          {
            "_id": "60d21b4667d0d8992e610c87",
            "name": "Clothing"
          }
        ],
        "logo": "https://example.com/logo.jpg",
        "coverImage": "https://example.com/cover.jpg",
        "mainImage": "https://example.com/main.jpg",
        "allImages": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "popularity_index": 95,
        "isBrand": true,
        "isOpen": true,
        "opensAt": "09:00",
        "closesAt": "21:00",
        "is_24_7": false,
        "location": {
          "type": "Point",
          "coordinates": [72.8777, 19.076]
        },
        "averageRating": 4.5,
        "reviewCount": 45,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "tagline": "Best Electronics Deals",
        "description": "One-stop shop for all electronics",
        "owner_id": "60d21b4667d0d8992e610c86",
        "business_phone_number": "+919876543211",
        "business_email": "contact@electronicshub.com",
        "full_address": "SV Road, Mumbai, Maharashtra 400002, India",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "serviceable_pincodes": ["400001", "400002", "400003", "400004"],
        "isPanIndia": true,
        "type": "retail",
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "productCategories": [
          {
            "_id": "60d21b4667d0d8992e610c88",
            "name": "Smartphones"
          },
          {
            "_id": "60d21b4667d0d8992e610c89",
            "name": "Laptops"
          }
        ],
        "logo": "https://example.com/logo2.jpg",
        "coverImage": "https://example.com/cover2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "allImages": [
          "https://example.com/image3.jpg",
          "https://example.com/image4.jpg"
        ],
        "popularity_index": 90,
        "isBrand": true,
        "isOpen": true,
        "opensAt": "10:00",
        "closesAt": "22:00",
        "is_24_7": false,
        "location": {
          "type": "Point",
          "coordinates": [72.8888, 19.088]
        },
        "averageRating": 4.7,
        "reviewCount": 65,
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Create Store

```
POST /api/stores
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Store",
  "tagline": "Best Store in Town",
  "description": "Detailed store description",
  "business_phone_number": "+919876543212",
  "business_email": "contact@newstore.com",
  "full_address": "Park Street, Mumbai, Maharashtra 400003, India",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "serviceable_pincodes": ["400001", "400002", "400003"],
  "isPanIndia": false,
  "type": "retail",
  "category": "60d21b4667d0d8992e610c86",
  "productCategories": ["60d21b4667d0d8992e610c87"],
  "logo": "https://example.com/newlogo.jpg",
  "coverImage": "https://example.com/newcover.jpg",
  "mainImage": "https://example.com/newmain.jpg",
  "allImages": [
    "https://example.com/newimage1.jpg",
    "https://example.com/newimage2.jpg"
  ],
  "isBrand": true,
  "isOpen": true,
  "opensAt": "09:00",
  "closesAt": "21:00",
  "is_24_7": false,
  "location": {
    "type": "Point",
    "coordinates": [72.8999, 19.099]
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "store": {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "New Store",
      "tagline": "Best Store in Town",
      "description": "Detailed store description",
      "owner_id": "60d21b4667d0d8992e610c85",
      "business_phone_number": "+919876543212",
      "business_email": "contact@newstore.com",
      "full_address": "Park Street, Mumbai, Maharashtra 400003, India",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "serviceable_pincodes": ["400001", "400002", "400003"],
      "isPanIndia": false,
      "type": "retail",
      "category": "60d21b4667d0d8992e610c86",
      "productCategories": ["60d21b4667d0d8992e610c87"],
      "logo": "https://example.com/newlogo.jpg",
      "coverImage": "https://example.com/newcover.jpg",
      "mainImage": "https://example.com/newmain.jpg",
      "allImages": [
        "https://example.com/newimage1.jpg",
        "https://example.com/newimage2.jpg"
      ],
      "popularity_index": 0,
      "isBrand": true,
      "isOpen": true,
      "opensAt": "09:00",
      "closesAt": "21:00",
      "is_24_7": false,
      "location": {
        "type": "Point",
        "coordinates": [72.8999, 19.099]
      },
      "averageRating": 0,
      "reviewCount": 0,
      "createdAt": "2023-01-03T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Get Single Store

```
GET /api/stores/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "store": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Fashion Store",
      "tagline": "Latest Fashion Trends",
      "description": "A store for all your fashion needs",
      "owner_id": "60d21b4667d0d8992e610c85",
      "business_phone_number": "+919876543210",
      "business_email": "contact@fashionstore.com",
      "full_address": "MG Road, Mumbai, Maharashtra 400001, India",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "serviceable_pincodes": ["400001", "400002", "400003"],
      "isPanIndia": false,
      "type": "retail",
      "category": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Fashion"
      },
      "productCategories": [
        {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Clothing"
        }
      ],
      "logo": "https://example.com/logo.jpg",
      "coverImage": "https://example.com/cover.jpg",
      "mainImage": "https://example.com/main.jpg",
      "allImages": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "popularity_index": 95,
      "isBrand": true,
      "isOpen": true,
      "opensAt": "09:00",
      "closesAt": "21:00",
      "is_24_7": false,
      "location": {
        "type": "Point",
        "coordinates": [72.8777, 19.076]
      },
      "averageRating": 4.5,
      "reviewCount": 45,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update Store

```
PATCH /api/stores/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "tagline": "Updated Fashion Trends",
  "description": "Updated store description",
  "isOpen": false
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "store": {
      "_id": "60d21b4667d0d8992e610c85",
      "tagline": "Updated Fashion Trends",
      "description": "Updated store description",
      "isOpen": false,
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Delete Store

```
DELETE /api/stores/:id
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

### Restore Store

```
PATCH /api/stores/:id/restore
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
    "store": {
      "_id": "60d21b4667d0d8992e610c85",
      "isDeleted": false,
      "deletedAt": null,
      "updatedAt": "2023-01-03T13:00:00.000Z"
    }
  }
}
```

### Get Top Selling Stores

```
GET /api/stores/top-selling
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
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "orderCount": 150,
        "averageRating": 4.5,
        "reviewCount": 45
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "orderCount": 120,
        "averageRating": 4.7,
        "reviewCount": 65
      }
    ]
  }
}
```

### Get Best Rated Stores

```
GET /api/stores/best-rated
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
        "averageRating": 4.7,
        "reviewCount": 65
      },
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "averageRating": 4.5,
        "reviewCount": 45
      }
    ]
  }
}
```

### Get Nearby Stores

```
GET /api/stores/nearby
```

**Query Parameters:**

- `lat` (required): Latitude
- `lng` (required): Longitude
- `distance` (optional): Distance in kilometers (default: 10)
- `limit` (optional): Number of results (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 1,
  "data": {
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "distance": 2.5,
        "location": {
          "type": "Point",
          "coordinates": [72.8777, 19.076]
        }
      }
    ]
  }
}
```

### Search Stores

```
GET /api/stores/search
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
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "tagline": "Latest Fashion Trends",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "averageRating": 4.5,
        "reviewCount": 45
      }
    ]
  }
}
```

### Search Stores with Filters

```
GET /api/stores/search-with-filters
```

**Query Parameters:**

- `query` (optional): Search query for text search
- `categoryIds` (optional): Comma-separated list of category IDs (includes subcategories automatically)
- `tags` (optional): Comma-separated list of tags
- `type` (optional): Store type filter
- `isOpen` (optional): Filter by open status (true/false)
- `isBrand` (optional): Filter by brand status (true/false)
- `isPanIndia` (optional): Filter by pan-India status (true/false)
- `pincode` (optional): Filter by serviceable pincode
- `sortBy` (optional): Sort results by (popularity, nearest, avgRating)
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
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "tagline": "Latest Fashion Trends",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "category": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Fashion"
        },
        "productCategories": [
          {
            "_id": "60d21b4667d0d8992e610c87",
            "name": "Clothing"
          }
        ],
        "averageRating": 4.5,
        "reviewCount": 45,
        "isOpen": true,
        "isBrand": true,
        "isPanIndia": false
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "tagline": "Best Electronics Deals",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "productCategories": [
          {
            "_id": "60d21b4667d0d8992e610c88",
            "name": "Smartphones"
          }
        ],
        "averageRating": 4.7,
        "reviewCount": 65,
        "isOpen": true,
        "isBrand": true,
        "isPanIndia": true
      }
    ]
  }
}
```

### Get My Stores

```
GET /api/stores/my-stores
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
  "results": 1,
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1,
    "limit": 10
  },
  "data": {
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "tagline": "Latest Fashion Trends",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "averageRating": 4.5,
        "reviewCount": 45,
        "orderCount": 150
      }
    ]
  }
}
```
