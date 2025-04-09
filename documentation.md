# Dukaan-Pe API Documentation

## Introduction

This document provides comprehensive documentation for the Dukaan-Pe API, designed for frontend developers and tools that need to integrate with our backend services. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

All API endpoints are prefixed with:

```
/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication.

### Authentication Endpoints

#### Request OTP

```
POST /api/auth/request-otp
```

**Request Body:**

```json
{
  "mobileNumber": "+919876543210"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "OTP sent successfully",
  "data": {
    "requestId": "otp_req_60d21b4667d0d8992e610c85",
    "expiresIn": 300
  }
}
```

#### Verify OTP and Login/Register

```
POST /api/auth/verify-otp
```

**Request Body:**

```json
{
  "mobileNumber": "+919876543210",
  "otp": "123456",
  "requestId": "otp_req_60d21b4667d0d8992e610c85",
  "name": "John Doe" // Optional, required only for new users
}
```

**Response:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": false, // true if user was registered for the first time
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "mobileNumber": "+919876543210",
      "role": "user"
    }
  }
}
```

#### Resend OTP

```
POST /api/auth/resend-otp
```

**Request Body:**

```json
{
  "mobileNumber": "+919876543210",
  "requestId": "otp_req_60d21b4667d0d8992e610c85"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "OTP resent successfully",
  "data": {
    "requestId": "otp_req_60d21b4667d0d8992e610c86",
    "expiresIn": 300
  }
}
```

#### Get Current User Profile

```
GET /api/auth/me
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
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

## Authentication for API Requests

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

If the token is missing, expired, or invalid, the API will respond with a 401 Unauthorized status code.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- 200: OK - The request was successful
- 201: Created - A new resource was successfully created
- 400: Bad Request - The request was invalid or cannot be served
- 401: Unauthorized - Authentication is required or failed
- 403: Forbidden - The authenticated user doesn't have permission
- 404: Not Found - The requested resource doesn't exist
- 500: Internal Server Error - Something went wrong on the server

Error responses follow this format:

```json
{
  "status": "error",
  "message": "Detailed error message"
}
```

In development mode, error responses may include a stack trace:

```json
{
  "status": "error",
  "message": "Detailed error message",
  "stack": "Error stack trace..."
}
```

## Address APIs

These endpoints allow users to manage their delivery addresses.

### Get All User Addresses

```
GET /api/addresses
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "addresses": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "user": "60d21b4667d0d8992e610c85",
        "location": {
          "type": "Point",
          "coordinates": [72.8777, 19.076]
        },
        "country": "India",
        "state": "Maharashtra",
        "city": "Mumbai",
        "pincode": "400001",
        "houseDetails": "Flat 101, Building A",
        "streetAddress": "MG Road",
        "directionToReach": "Near Post Office",
        "googleFetchedAddress": "MG Road, Mumbai, Maharashtra 400001, India",
        "type": "home",
        "isDefault": true,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "user": "60d21b4667d0d8992e610c85",
        "location": {
          "type": "Point",
          "coordinates": [72.8777, 19.076]
        },
        "country": "India",
        "state": "Maharashtra",
        "city": "Mumbai",
        "pincode": "400002",
        "houseDetails": "Office 202, Tower B",
        "streetAddress": "SV Road",
        "directionToReach": "Opposite Mall",
        "googleFetchedAddress": "SV Road, Mumbai, Maharashtra 400002, India",
        "type": "work",
        "isDefault": false,
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Single Address

```
GET /api/addresses/:id
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
    "address": {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "location": {
        "type": "Point",
        "coordinates": [72.8777, 19.076]
      },
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "pincode": "400001",
      "houseDetails": "Flat 101, Building A",
      "streetAddress": "MG Road",
      "directionToReach": "Near Post Office",
      "googleFetchedAddress": "MG Road, Mumbai, Maharashtra 400001, India",
      "type": "home",
      "isDefault": true,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Add New Address

```
POST /api/addresses
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.076]
  },
  "country": "India",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "houseDetails": "Flat 101, Building A",
  "streetAddress": "MG Road",
  "directionToReach": "Near Post Office",
  "googleFetchedAddress": "MG Road, Mumbai, Maharashtra 400001, India",
  "type": "home",
  "isDefault": true
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "address": {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "location": {
        "type": "Point",
        "coordinates": [72.8777, 19.076]
      },
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "pincode": "400001",
      "houseDetails": "Flat 101, Building A",
      "streetAddress": "MG Road",
      "directionToReach": "Near Post Office",
      "googleFetchedAddress": "MG Road, Mumbai, Maharashtra 400001, India",
      "type": "home",
      "isDefault": true,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update Address

```
PATCH /api/addresses/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "houseDetails": "Flat 102, Building A",
  "directionToReach": "Near Bank"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "address": {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "location": {
        "type": "Point",
        "coordinates": [72.8777, 19.076]
      },
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "pincode": "400001",
      "houseDetails": "Flat 102, Building A",
      "streetAddress": "MG Road",
      "directionToReach": "Near Bank",
      "googleFetchedAddress": "MG Road, Mumbai, Maharashtra 400001, India",
      "type": "home",
      "isDefault": true,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Delete Address

```
DELETE /api/addresses/:id
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

### Set Default Address

```
PATCH /api/addresses/:id/set-default
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
    "address": {
      "_id": "60d21b4667d0d8992e610c85",
      "isDefault": true,
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

## Store APIs

These endpoints allow users to interact with stores on the platform.

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
        "description": "We offer the latest fashion trends at affordable prices.",
        "owner_id": "60d21b4667d0d8992e610c85",
        "business_phone_number": "+919876543210",
        "business_email": "contact@fashionstore.com",
        "full_address": "123, Fashion Street, Mumbai",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "serviceable_pincodes": ["400001", "400002"],
        "isPanIndia": false,
        "type": "physical_product",
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Fashion"
        },
        "logo": "https://example.com/logo.jpg",
        "coverImage": "https://example.com/cover.jpg",
        "mainImage": "https://example.com/main.jpg",
        "allImages": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "popularity_index": 85,
        "isBrand": true,
        "isOpen": true,
        "opensAt": "09:00",
        "closesAt": "21:00",
        "is_24_7": false,
        "orderCount": 120,
        "averageRating": 4.5,
        "reviewCount": 45,
        "wishlistCount": 78,
        "location": {
          "type": "Point",
          "coordinates": [72.8777, 19.076]
        },
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "tagline": "Best Electronics Deals",
        "description": "One-stop shop for all your electronics needs.",
        "owner_id": "60d21b4667d0d8992e610c86",
        "business_phone_number": "+919876543211",
        "business_email": "contact@electronicshub.com",
        "full_address": "456, Tech Street, Bangalore",
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "India",
        "serviceable_pincodes": ["560001", "560002"],
        "isPanIndia": true,
        "type": "physical_product",
        "category": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics"
        },
        "logo": "https://example.com/logo2.jpg",
        "coverImage": "https://example.com/cover2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "allImages": [
          "https://example.com/image3.jpg",
          "https://example.com/image4.jpg"
        ],
        "popularity_index": 92,
        "isBrand": true,
        "isOpen": true,
        "opensAt": "10:00",
        "closesAt": "20:00",
        "is_24_7": false,
        "orderCount": 200,
        "averageRating": 4.7,
        "reviewCount": 65,
        "wishlistCount": 120,
        "location": {
          "type": "Point",
          "coordinates": [77.5946, 12.9716]
        },
        "createdAt": "2023-01-02T12:00:00.000Z",
        "updatedAt": "2023-01-02T12:00:00.000Z"
      }
    ]
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
      "description": "We offer the latest fashion trends at affordable prices.",
      "owner_id": "60d21b4667d0d8992e610c85",
      "business_phone_number": "+919876543210",
      "business_email": "contact@fashionstore.com",
      "full_address": "123, Fashion Street, Mumbai",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "serviceable_pincodes": ["400001", "400002"],
      "isPanIndia": false,
      "type": "physical_product",
      "category": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion"
      },
      "logo": "https://example.com/logo.jpg",
      "coverImage": "https://example.com/cover.jpg",
      "mainImage": "https://example.com/main.jpg",
      "allImages": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "popularity_index": 85,
      "isBrand": true,
      "isOpen": true,
      "opensAt": "09:00",
      "closesAt": "21:00",
      "is_24_7": false,
      "orderCount": 120,
      "averageRating": 4.5,
      "reviewCount": 45,
      "wishlistCount": 78,
      "location": {
        "type": "Point",
        "coordinates": [72.8777, 19.076]
      },
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Create Store (Protected)

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
  "tagline": "Store Tagline",
  "description": "Detailed store description",
  "business_phone_number": "+919876543212",
  "business_email": "contact@newstore.com",
  "full_address": "789, New Street, Delhi",
  "city": "Delhi",
  "state": "Delhi",
  "country": "India",
  "serviceable_pincodes": ["110001", "110002"],
  "isPanIndia": false,
  "type": "physical_product",
  "category": "60d21b4667d0d8992e610c87",
  "logo": "https://example.com/newlogo.jpg",
  "coverImage": "https://example.com/newcover.jpg",
  "mainImage": "https://example.com/newmain.jpg",
  "allImages": [
    "https://example.com/newimage1.jpg",
    "https://example.com/newimage2.jpg"
  ],
  "isBrand": false,
  "isOpen": true,
  "opensAt": "08:00",
  "closesAt": "22:00",
  "is_24_7": false
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "store": {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "New Store",
      "tagline": "Store Tagline",
      "description": "Detailed store description",
      "owner_id": "60d21b4667d0d8992e610c85",
      "business_phone_number": "+919876543212",
      "business_email": "contact@newstore.com",
      "full_address": "789, New Street, Delhi",
      "city": "Delhi",
      "state": "Delhi",
      "country": "India",
      "serviceable_pincodes": ["110001", "110002"],
      "isPanIndia": false,
      "type": "physical_product",
      "category": "60d21b4667d0d8992e610c87",
      "logo": "https://example.com/newlogo.jpg",
      "coverImage": "https://example.com/newcover.jpg",
      "mainImage": "https://example.com/newmain.jpg",
      "allImages": [
        "https://example.com/newimage1.jpg",
        "https://example.com/newimage2.jpg"
      ],
      "popularity_index": 0,
      "isBrand": false,
      "isOpen": true,
      "opensAt": "08:00",
      "closesAt": "22:00",
      "is_24_7": false,
      "orderCount": 0,
      "averageRating": 0,
      "reviewCount": 0,
      "wishlistCount": 0,
      "createdAt": "2023-01-03T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Update Store (Protected)

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
  "tagline": "Updated Store Tagline",
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
      "_id": "60d21b4667d0d8992e610c88",
      "tagline": "Updated Store Tagline",
      "description": "Updated store description",
      "isOpen": false,
      "updatedAt": "2023-01-03T13:00:00.000Z"
    }
  }
}
```

### Delete Store (Protected)

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
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "orderCount": 200,
        "averageRating": 4.7
      },
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "orderCount": 120,
        "averageRating": 4.5
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

## Product APIs

These endpoints allow users to interact with products on the platform.

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
            "options": ["64GB", "128GB"]
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
        "popularityIndex": 85,
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
          "options": ["64GB", "128GB"]
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
      "popularityIndex": 85,
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
    }
  }
}
```

### Create Product (Protected)

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

### Update Product (Protected)

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

### Delete Product (Protected)

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

## Cart APIs

These endpoints allow users to manage their shopping cart.

### Get User Cart

```
GET /api/cart
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
    "cart": {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "store": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg"
      },
      "items": [
        {
          "product": {
            "_id": "60d21b4667d0d8992e610c85",
            "name": "Smartphone X",
            "mainImage": "https://example.com/smartphone.jpg",
            "price": 50000,
            "sellingPrice": 45000,
            "inventory": 50
          },
          "quantity": 1,
          "variant": "Black",
          "size": null,
          "effectivePrice": 45000,
          "price": 50000,
          "discountAmt": 5000,
          "discountPercentage": 10,
          "couponDiscount": 0,
          "couponDiscountPercentage": 0,
          "offerDiscount": 0,
          "offerDiscountPercentage": 0
        }
      ],
      "coupon": null,
      "offer": null,
      "isActive": true,
      "state": "active",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Add Item to Cart

```
POST /api/cart/add-item
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "productId": "60d21b4667d0d8992e610c85",
  "quantity": 1,
  "variant": "Black",
  "size": null
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c86",
      "items": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 1,
          "variant": "Black",
          "size": null,
          "effectivePrice": 45000,
          "price": 50000,
          "discountAmt": 5000,
          "discountPercentage": 10,
          "couponDiscount": 0,
          "couponDiscountPercentage": 0,
          "offerDiscount": 0,
          "offerDiscountPercentage": 0
        }
      ],
      "coupon": null,
      "offer": null,
      "isActive": true,
      "state": "active",
      "updatedAt": "2023-01-01T12:30:00.000Z"
    }
  }
}
```

### Update Cart Item

```
PATCH /api/cart/update-item
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "productId": "60d21b4667d0d8992e610c85",
  "quantity": 2,
  "variant": "Black",
  "size": null
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "60d21b4667d0d8992e610c85",
      "items": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 2,
          "variant": "Black",
          "size": null,
          "effectivePrice": 90000,
          "price": 100000,
          "discountAmt": 10000,
          "discountPercentage": 10
        }
      ],
      "updatedAt": "2023-01-01T13:00:00.000Z"
    }
  }
}
```

### Remove Item from Cart

```
DELETE /api/cart/remove-item
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "productId": "60d21b4667d0d8992e610c85"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "60d21b4667d0d8992e610c85",
      "items": [],
      "updatedAt": "2023-01-01T13:30:00.000Z"
    }
  }
}
```

### Apply Coupon to Cart

```
POST /api/cart/apply-coupon
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "couponCode": "WELCOME10"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "60d21b4667d0d8992e610c85",
      "coupon": {
        "_id": "60d21b4667d0d8992e610c87",
        "code": "WELCOME10",
        "discountPercentage": 10
      },
      "items": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 2,
          "effectivePrice": 81000,
          "price": 100000,
          "discountAmt": 10000,
          "discountPercentage": 10,
          "couponDiscount": 9000,
          "couponDiscountPercentage": 10
        }
      ],
      "updatedAt": "2023-01-01T14:00:00.000Z"
    }
  }
}
```

## Order APIs

These endpoints allow users to manage their orders.

### Create Order

```
POST /api/orders
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "cartId": "60d21b4667d0d8992e610c85",
  "paymentType": "card",
  "deliveryAddressId": "60d21b4667d0d8992e610c85",
  "specialNoteBuyer": "Please deliver after 6 PM",
  "specialNoteSeller": "Gift wrap the items"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "60d21b4667d0d8992e610c88",
      "orderNumber": "ORD-230101-0001",
      "cartSnapshot": "60d21b4667d0d8992e610c89",
      "user": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c86",
      "items": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "name": "Smartphone X",
          "mainImage": "https://example.com/smartphone.jpg",
          "quantity": 2,
          "variant": "Black",
          "size": null,
          "price": 50000,
          "sellingPrice": 45000,
          "totalPrice": 100000,
          "totalSellingPrice": 90000,
          "totalDiscount": 10000,
          "couponDiscount": 9000,
          "offerDiscount": 0,
          "finalPrice": 81000
        }
      ],
      "paymentType": "card",
      "paymentStatus": "pending",
      "totalWithoutDiscount": 100000,
      "totalPayableAmount": 81000,
      "totalDiscount": 19000,
      "couponDiscount": 9000,
      "offerDiscount": 0,
      "deliveryCharges": 0,
      "orderStatus": "pending",
      "specialNoteBuyer": "Please deliver after 6 PM",
      "specialNoteSeller": "Gift wrap the items",
      "deliveryAddressId": "60d21b4667d0d8992e610c85",
      "isActive": true,
      "createdAt": "2023-01-01T15:00:00.000Z",
      "updatedAt": "2023-01-01T15:00:00.000Z"
    }
  }
}
```

### Get User Orders

```
GET /api/orders
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `status` (optional): Filter by order status

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "60d21b4667d0d8992e610c88",
        "orderNumber": "ORD-230101-0001",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg"
        },
        "totalPayableAmount": 81000,
        "orderStatus": "pending",
        "paymentStatus": "pending",
        "createdAt": "2023-01-01T15:00:00.000Z",
        "deliveryTrackingId": {
          "currentStatus": "processing"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
}
```

### Get Order Details

```
GET /api/orders/:id
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
    "order": {
      "_id": "60d21b4667d0d8992e610c88",
      "orderNumber": "ORD-230101-0001",
      "user": "60d21b4667d0d8992e610c85",
      "store": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "business_phone_number": "+919876543211",
        "business_email": "contact@electronicshub.com"
      },
      "items": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "name": "Smartphone X",
          "mainImage": "https://example.com/smartphone.jpg",
          "quantity": 2,
          "variant": "Black",
          "size": null,
          "price": 50000,
          "sellingPrice": 45000,
          "totalPrice": 100000,
          "totalSellingPrice": 90000,
          "totalDiscount": 10000,
          "couponDiscount": 9000,
          "offerDiscount": 0,
          "finalPrice": 81000
        }
      ],
      "paymentType": "card",
      "paymentStatus": "pending",
      "totalWithoutDiscount": 100000,
      "totalPayableAmount": 81000,
      "totalDiscount": 19000,
      "couponDiscount": 9000,
      "offerDiscount": 0,
      "deliveryCharges": 0,
      "orderStatus": "pending",
      "specialNoteBuyer": "Please deliver after 6 PM",
      "specialNoteSeller": "Gift wrap the items",
      "deliveryAddress": {
        "_id": "60d21b4667d0d8992e610c85",
        "houseDetails": "Flat 101, Building A",
        "streetAddress": "MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "pincode": "400001"
      },
      "createdAt": "2023-01-01T15:00:00.000Z",
      "updatedAt": "2023-01-01T15:00:00.000Z",
      "tracking": {
        "_id": "60d21b4667d0d8992e610c90",
        "currentStatus": "processing",
        "statusHistory": [
          {
            "status": "pending",
            "description": "Order has been placed",
            "timestamp": "2023-01-01T15:00:00.000Z"
          },
          {
            "status": "processing",
            "description": "Order is being processed",
            "timestamp": "2023-01-01T15:30:00.000Z"
          }
        ]
      }
    }
  }
}
```

### Cancel Order

```
POST /api/orders/:id/cancel
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "reason": "Changed my mind"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "60d21b4667d0d8992e610c88",
      "orderStatus": "cancelled",
      "cancelReason": "Changed my mind",
      "cancelledAt": "2023-01-01T16:00:00.000Z",
      "updatedAt": "2023-01-01T16:00:00.000Z"
    }
  }
}
```

## Payment APIs

These endpoints allow users to manage payments for their orders.

### Create Razorpay Order

```
POST /api/payments/create-razorpay-order
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": "60d21b4667d0d8992e610c88"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_JDcW8XfOkBGjHB",
    "amount": 81000,
    "currency": "INR",
    "orderId": "60d21b4667d0d8992e610c88"
  }
}
```

### Verify Payment

```
POST /api/payments/verify
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": "60d21b4667d0d8992e610c88",
  "razorpayPaymentId": "pay_JDcWLx3K4sQYDc",
  "razorpayOrderId": "order_JDcW8XfOkBGjHB",
  "razorpaySignature": "b779e7a1a32d3b1d68ca2ef0b3d8f5717f3f26ddb755e6d586018bf9d2572812"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "payment": {
      "_id": "60d21b4667d0d8992e610c91",
      "user": "60d21b4667d0d8992e610c85",
      "order": "60d21b4667d0d8992e610c88",
      "amount": 81000,
      "currency": "INR",
      "razorpayPaymentId": "pay_JDcWLx3K4sQYDc",
      "razorpayOrderId": "order_JDcW8XfOkBGjHB",
      "razorpaySignature": "b779e7a1a32d3b1d68ca2ef0b3d8f5717f3f26ddb755e6d586018bf9d2572812",
      "paymentMethod": "card",
      "status": "captured",
      "createdAt": "2023-01-01T16:30:00.000Z",
      "updatedAt": "2023-01-01T16:30:00.000Z"
    },
    "order": {
      "_id": "60d21b4667d0d8992e610c88",
      "paymentStatus": "captured",
      "orderStatus": "confirmed",
      "updatedAt": "2023-01-01T16:30:00.000Z"
    }
  }
}
```

### Process Refund

```
POST /api/payments/:id/refund
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "amount": 81000,
  "reason": "Customer requested refund"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "payment": {
      "_id": "60d21b4667d0d8992e610c91",
      "status": "refunded",
      "refundAmount": 81000,
      "refundReason": "Customer requested refund",
      "refundId": "rfnd_JDcXLx3K4sQYDc",
      "refundStatus": "processed",
      "refundedAt": "2023-01-01T17:00:00.000Z",
      "updatedAt": "2023-01-01T17:00:00.000Z"
    },
    "order": {
      "_id": "60d21b4667d0d8992e610c88",
      "paymentStatus": "refunded",
      "orderStatus": "cancelled",
      "updatedAt": "2023-01-01T17:00:00.000Z"
    }
  }
}
```

## Pincode Serviceability API

This endpoint allows you to check if a pincode is serviceable by any store on the platform.

### Check Pincode Serviceability

```
GET /api/pincode/is-serviceable
```

**Query Parameters:**

- `pincode` (required): The 6-digit pincode to check

**Response:**

```json
{
  "status": "success",
  "data": {
    "pincode": "400001",
    "isServiceable": true,
    "storeCount": 5,
    "message": "This pincode is serviceable by 5 store(s)"
  }
}
```

If no stores service the pincode:

```json
{
  "status": "success",
  "data": {
    "pincode": "999999",
    "isServiceable": false,
    "storeCount": 0,
    "message": "This pincode is not serviceable"
  }
}
```

## Catalogue Products API

Catalogue Products are generalized product templates that are not specific to any store. They serve as a reference for store-specific products.

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
            "inventory": 50,
            "sku": "SMRTX-BLK"
          },
          {
            "name": "Color",
            "value": "White",
            "inventory": 30,
            "sku": "SMRTX-WHT"
          }
        ],
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "popularityIndex": 85,
        "orderCount": 120,
        "reviewCount": 45,
        "averageRating": 4.5,
        "wishlistCount": 78,
        "inventory": 80,
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
            "inventory": 25,
            "sku": "LPTP-SLV"
          },
          {
            "name": "RAM",
            "value": "16GB",
            "inventory": 15,
            "sku": "LPTP-16GB"
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
          "inventory": 50,
          "sku": "SMRTX-BLK"
        },
        {
          "name": "Color",
          "value": "White",
          "inventory": 30,
          "sku": "SMRTX-WHT"
        }
      ],
      "category": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Electronics"
      },
      "popularityIndex": 85,
      "orderCount": 120,
      "reviewCount": 45,
      "averageRating": 4.5,
      "wishlistCount": 78,
      "inventory": 80,
      "tags": ["smartphone", "electronics", "mobile"],
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

### Create Catalogue Product (Protected/Admin)

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

## Product Categories API

These endpoints allow users to interact with product categories on the platform.

### Get All Product Categories

```
GET /api/product-categories
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
        "name": "Electronics",
        "image": "https://example.com/electronics.jpg",
        "popularityIndex": 95,
        "noOfProducts": 120,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Fashion",
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

## Store Categories API

These endpoints allow users to interact with store categories on the platform.

### Get All Store Categories

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
        "image": "https://example.com/electronics-stores.jpg",
        "popularityIndex": 95,
        "noOfStores": 50,
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Fashion Stores",
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

## Product Reviews API

These endpoints allow users to interact with product reviews on the platform.

### Get All Reviews for a Product

```
GET /api/products/:productId/reviews
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
    "total": 45,
    "page": 1,
    "pages": 23,
    "limit": 2
  },
  "data": {
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c90",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe"
        },
        "product": "60d21b4667d0d8992e610c85",
        "rating": 5,
        "title": "Great product!",
        "comment": "This is an amazing product. Highly recommended!",
        "createdAt": "2023-01-05T12:00:00.000Z",
        "updatedAt": "2023-01-05T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c91",
        "user": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Jane Smith"
        },
        "product": "60d21b4667d0d8992e610c85",
        "rating": 4,
        "title": "Good product",
        "comment": "Good product for the price.",
        "createdAt": "2023-01-06T12:00:00.000Z",
        "updatedAt": "2023-01-06T12:00:00.000Z"
      }
    ]
  }
}
```

### Get User's Product Reviews

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
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c90",
        "product": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Smartphone X",
          "mainImage": "https://example.com/smartphone.jpg"
        },
        "rating": 5,
        "title": "Great product!",
        "comment": "This is an amazing product. Highly recommended!",
        "createdAt": "2023-01-05T12:00:00.000Z",
        "updatedAt": "2023-01-05T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c92",
        "product": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Laptop Pro",
          "mainImage": "https://example.com/laptop.jpg"
        },
        "rating": 4,
        "title": "Good laptop",
        "comment": "Good laptop for the price.",
        "createdAt": "2023-01-07T12:00:00.000Z",
        "updatedAt": "2023-01-07T12:00:00.000Z"
      }
    ]
  }
}
```

## Product Wishlist API

These endpoints allow users to interact with their product wishlist.

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
        "_id": "60d21b4667d0d8992e610c95",
        "product": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Smartphone X",
          "mainImage": "https://example.com/smartphone.jpg",
          "price": 50000,
          "sellingPrice": 45000,
          "discountPercentage": 10,
          "averageRating": 4.5,
          "reviewCount": 45
        },
        "createdAt": "2023-01-10T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c96",
        "product": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Laptop Pro",
          "mainImage": "https://example.com/laptop.jpg",
          "price": 80000,
          "sellingPrice": 75000,
          "discountPercentage": 6.25,
          "averageRating": 4.7,
          "reviewCount": 30
        },
        "createdAt": "2023-01-11T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Popular Wishlisted Products

```
GET /api/product-wishlist/popular
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `store_id` (optional): Filter by store ID

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

## Store Wishlist API

These endpoints allow users to interact with their store wishlist.

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
    "total": 4,
    "page": 1,
    "pages": 2,
    "limit": 2
  },
  "data": {
    "wishlist": [
      {
        "_id": "60d21b4667d0d8992e610c97",
        "store": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Fashion Store",
          "logo": "https://example.com/logo.jpg",
          "mainImage": "https://example.com/main.jpg",
          "tagline": "Latest Fashion Trends",
          "averageRating": 4.5,
          "reviewCount": 45
        },
        "createdAt": "2023-01-12T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c98",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo2.jpg",
          "mainImage": "https://example.com/main2.jpg",
          "tagline": "Best Electronics Deals",
          "averageRating": 4.7,
          "reviewCount": 65
        },
        "createdAt": "2023-01-13T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Popular Wishlisted Stores

```
GET /api/store-wishlist/popular
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `pincode` (optional): Filter by pincode
- `isBrand` (optional): Filter by brand status (true/false)

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
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg",
        "mainImage": "https://example.com/main2.jpg",
        "tagline": "Best Electronics Deals",
        "averageRating": 4.7,
        "reviewCount": 65,
        "wishlistCount": 120
      },
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg",
        "mainImage": "https://example.com/main.jpg",
        "tagline": "Latest Fashion Trends",
        "averageRating": 4.5,
        "reviewCount": 45,
        "wishlistCount": 78
      }
    ]
  }
}
```

## Conclusion

This documentation covers the main API endpoints available in the Dukaan-Pe backend. For frontend developers, these endpoints provide all the necessary functionality to build a complete e-commerce application.

### API Structure Summary

1. **Authentication APIs** - Register, login, and get user profile
2. **Address APIs** - Manage user delivery addresses
3. **Store APIs** - Browse, search, and manage stores
4. **Store Categories APIs** - Browse and manage store categories
5. **Store Wishlist APIs** - Manage store wishlist
6. **Product APIs** - Browse, search, and manage products
7. **Product Categories APIs** - Browse and manage product categories
8. **Product Reviews APIs** - Browse and manage product reviews
9. **Product Wishlist APIs** - Manage product wishlist
10. **Catalogue Products APIs** - Manage generalized product templates
11. **Pincode Serviceability API** - Check if a pincode is serviceable
12. **Cart APIs** - Manage shopping cart and apply discounts
13. **Order APIs** - Create and manage orders
14. **Payment APIs** - Process payments and refunds

### Common Response Formats

Most API responses follow a consistent format:

```json
{
  "status": "success",
  "data": { ... }
}
```

or in case of errors:

```json
{
  "status": "error",
  "message": "Error message"
}
```

### Pagination

**All list endpoints** in the API support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10 for most endpoints, 20 for categories)

Paginated responses include pagination metadata:

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### Authentication

Remember that most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Image Upload API

This endpoint allows users to upload images to the server. The images are stored in a public static folder and the URL of the uploaded image is returned.

### Upload Image

```
POST /api/upload/image
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

Form data with the following fields:

- `image`: The image file to upload (supported formats: JPG, PNG, JPEG, WEBP)
- `type` (optional): The type of image being uploaded (e.g., "product", "store", "profile", etc.)

**Response:**

```json
{
  "status": "success",
  "data": {
    "imageUrl": "https://api.dukaanpe.com/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800000.jpg",
    "relativePath": "/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800000.jpg"
  }
}
```

### Upload Multiple Images

```
POST /api/upload/images
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

Form data with the following fields:

- `images`: Array of image files to upload (supported formats: JPG, PNG, JPEG, WEBP)
- `type` (optional): The type of images being uploaded (e.g., "product", "store", "profile", etc.)

**Response:**

```json
{
  "status": "success",
  "data": {
    "imageUrls": [
      "https://api.dukaanpe.com/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800000.jpg",
      "https://api.dukaanpe.com/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800001.jpg"
    ],
    "relativePaths": [
      "/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800000.jpg",
      "/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800001.jpg"
    ]
  }
}
```

### Delete Image

```
DELETE /api/upload/image
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "imagePath": "/static/images/uploads/product_60d21b4667d0d8992e610c85_1641034800000.jpg"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Image deleted successfully"
}
```

### Need Help?

If you encounter any issues or need further clarification on any API endpoint, please contact the backend development team.
