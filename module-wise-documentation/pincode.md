# Pincode API

The Pincode API allows users to check if a pincode is serviceable by any stores on the platform.

## Base URL

All API endpoints are prefixed with:

```
/api/pincode
```

## Endpoints

### Check if Pincode is Serviceable

```
GET /api/pincode/is-serviceable
```

**Query Parameters:**

- `pincode` (required): The pincode to check

**Response (Serviceable):**

```json
{
  "status": "success",
  "data": {
    "isServiceable": true,
    "stores": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Fashion Store",
        "logo": "https://example.com/logo.jpg"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Electronics Hub",
        "logo": "https://example.com/logo2.jpg"
      }
    ]
  }
}
```

**Response (Not Serviceable):**

```json
{
  "status": "success",
  "data": {
    "isServiceable": false,
    "stores": []
  }
}
```

**Notes:**

- This endpoint checks if any stores on the platform service the provided pincode
- A pincode is considered serviceable if at least one store has it in their serviceable_pincodes array or if a store is marked as isPanIndia: true
- The response includes a list of stores that service the pincode
- This endpoint is useful for checking delivery availability before a user starts shopping
