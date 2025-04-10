# Address API

The Address API allows users to manage their delivery addresses.

## Base URL

All API endpoints are prefixed with:

```
/api/addresses
```

## Endpoints

### Get All Addresses

```
GET /api/addresses
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
    "total": 2,
    "page": 1,
    "pages": 1,
    "limit": 10
  },
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
        "directionToReach": "Near Central Mall",
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
          "coordinates": [72.8888, 19.088]
        },
        "country": "India",
        "state": "Maharashtra",
        "city": "Mumbai",
        "pincode": "400002",
        "houseDetails": "Office 202, Building B",
        "streetAddress": "SV Road",
        "directionToReach": "Opposite Railway Station",
        "googleFetchedAddress": "SV Road, Mumbai, Maharashtra 400002, India",
        "type": "work",
        "isDefault": false,
        "createdAt": "2023-01-01T13:00:00.000Z",
        "updatedAt": "2023-01-01T13:00:00.000Z"
      }
    ]
  }
}
```

### Create Address

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
  "directionToReach": "Near Central Mall",
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
      "directionToReach": "Near Central Mall",
      "googleFetchedAddress": "MG Road, Mumbai, Maharashtra 400001, India",
      "type": "home",
      "isDefault": true,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
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
      "directionToReach": "Near Central Mall",
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
  "directionToReach": "Near Central Mall, 2nd Floor"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "address": {
      "_id": "60d21b4667d0d8992e610c85",
      "houseDetails": "Flat 102, Building A",
      "directionToReach": "Near Central Mall, 2nd Floor",
      "updatedAt": "2023-01-01T14:00:00.000Z"
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

### Restore Address

```
PATCH /api/addresses/:id/restore
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
      "isDeleted": false,
      "deletedAt": null,
      "updatedAt": "2023-01-01T15:00:00.000Z"
    }
  }
}
```
