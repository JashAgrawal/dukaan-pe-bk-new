# Order API

The Order API allows users to create and manage orders.

## Base URL

All API endpoints are prefixed with:

```
/api/orders
```

## Endpoints

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
  "addressId": "60d21b4667d0d8992e610c85",
  "paymentMethod": "razorpay",
  "couponCode": "WELCOME10"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "60d21b4667d0d8992e610c85",
      "orderNumber": "ORD-1234567890",
      "user": "60d21b4667d0d8992e610c85",
      "items": [
        {
          "product": {
            "_id": "60d21b4667d0d8992e610c85",
            "name": "Smartphone X",
            "mainImage": "https://example.com/smartphone.jpg"
          },
          "quantity": 2,
          "variant": {
            "color": "Black",
            "storage": "128GB"
          },
          "price": 45000,
          "totalPrice": 90000,
          "store": "60d21b4667d0d8992e610c86"
        }
      ],
      "storeOrders": [
        {
          "store": {
            "_id": "60d21b4667d0d8992e610c86",
            "name": "Electronics Hub"
          },
          "items": [
            {
              "product": "60d21b4667d0d8992e610c85",
              "quantity": 2,
              "variant": {
                "color": "Black",
                "storage": "128GB"
              },
              "price": 45000,
              "totalPrice": 90000
            }
          ],
          "subtotal": 90000,
          "discount": 9000,
          "total": 81000,
          "status": "pending"
        }
      ],
      "address": {
        "_id": "60d21b4667d0d8992e610c85",
        "houseDetails": "Flat 101, Building A",
        "streetAddress": "MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "paymentMethod": "razorpay",
      "paymentStatus": "pending",
      "coupon": {
        "code": "WELCOME10",
        "discount": 10,
        "discountType": "percentage"
      },
      "subtotal": 90000,
      "discount": 9000,
      "total": 81000,
      "status": "pending",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Get All User Orders

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
- `status` (optional): Filter by order status (pending, processing, shipped, delivered, cancelled)

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
    "orders": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "orderNumber": "ORD-1234567890",
        "user": "60d21b4667d0d8992e610c85",
        "items": [
          {
            "product": {
              "_id": "60d21b4667d0d8992e610c85",
              "name": "Smartphone X",
              "mainImage": "https://example.com/smartphone.jpg"
            },
            "quantity": 2,
            "variant": {
              "color": "Black",
              "storage": "128GB"
            },
            "price": 45000,
            "totalPrice": 90000,
            "store": {
              "_id": "60d21b4667d0d8992e610c86",
              "name": "Electronics Hub"
            }
          }
        ],
        "total": 81000,
        "status": "delivered",
        "paymentStatus": "paid",
        "createdAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "orderNumber": "ORD-0987654321",
        "user": "60d21b4667d0d8992e610c85",
        "items": [
          {
            "product": {
              "_id": "60d21b4667d0d8992e610c86",
              "name": "Laptop Pro",
              "mainImage": "https://example.com/laptop.jpg"
            },
            "quantity": 1,
            "variant": {
              "color": "Silver",
              "ram": "16GB",
              "storage": "512GB"
            },
            "price": 75000,
            "totalPrice": 75000,
            "store": {
              "_id": "60d21b4667d0d8992e610c86",
              "name": "Electronics Hub"
            }
          }
        ],
        "total": 75000,
        "status": "shipped",
        "paymentStatus": "paid",
        "createdAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Single Order

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
  "status": "success",
  "data": {
    "order": {
      "_id": "60d21b4667d0d8992e610c85",
      "orderNumber": "ORD-1234567890",
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "mobileNumber": "+919876543210"
      },
      "items": [
        {
          "product": {
            "_id": "60d21b4667d0d8992e610c85",
            "name": "Smartphone X",
            "mainImage": "https://example.com/smartphone.jpg"
          },
          "quantity": 2,
          "variant": {
            "color": "Black",
            "storage": "128GB"
          },
          "price": 45000,
          "totalPrice": 90000,
          "store": {
            "_id": "60d21b4667d0d8992e610c86",
            "name": "Electronics Hub"
          }
        }
      ],
      "storeOrders": [
        {
          "store": {
            "_id": "60d21b4667d0d8992e610c86",
            "name": "Electronics Hub"
          },
          "items": [
            {
              "product": {
                "_id": "60d21b4667d0d8992e610c85",
                "name": "Smartphone X",
                "mainImage": "https://example.com/smartphone.jpg"
              },
              "quantity": 2,
              "variant": {
                "color": "Black",
                "storage": "128GB"
              },
              "price": 45000,
              "totalPrice": 90000
            }
          ],
          "subtotal": 90000,
          "discount": 9000,
          "total": 81000,
          "status": "delivered",
          "trackingDetails": {
            "courier": "Express Delivery",
            "trackingNumber": "ED123456789",
            "trackingUrl": "https://expressdelivery.com/track/ED123456789"
          }
        }
      ],
      "address": {
        "_id": "60d21b4667d0d8992e610c85",
        "houseDetails": "Flat 101, Building A",
        "streetAddress": "MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "paymentMethod": "razorpay",
      "paymentStatus": "paid",
      "paymentDetails": {
        "razorpayOrderId": "order_123456789",
        "razorpayPaymentId": "pay_123456789",
        "razorpaySignature": "signature_123456789"
      },
      "coupon": {
        "code": "WELCOME10",
        "discount": 10,
        "discountType": "percentage"
      },
      "subtotal": 90000,
      "discount": 9000,
      "total": 81000,
      "status": "delivered",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2023-01-01T12:00:00.000Z"
        },
        {
          "status": "processing",
          "timestamp": "2023-01-01T13:00:00.000Z"
        },
        {
          "status": "shipped",
          "timestamp": "2023-01-02T12:00:00.000Z"
        },
        {
          "status": "delivered",
          "timestamp": "2023-01-03T12:00:00.000Z"
        }
      ],
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-03T12:00:00.000Z"
    }
  }
}
```

### Cancel Order

```
PATCH /api/orders/:id/cancel
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "cancellationReason": "Changed my mind"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "60d21b4667d0d8992e610c85",
      "status": "cancelled",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2023-01-01T12:00:00.000Z"
        },
        {
          "status": "cancelled",
          "timestamp": "2023-01-01T14:00:00.000Z"
        }
      ],
      "cancellationReason": "Changed my mind",
      "updatedAt": "2023-01-01T14:00:00.000Z"
    }
  }
}
```

### Get Store Orders

```
GET /api/stores/:storeId/orders
```

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `status` (optional): Filter by order status (pending, processing, shipped, delivered, cancelled)

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
    "orders": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "orderNumber": "ORD-1234567890",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe",
          "mobileNumber": "+919876543210"
        },
        "items": [
          {
            "product": {
              "_id": "60d21b4667d0d8992e610c85",
              "name": "Smartphone X",
              "mainImage": "https://example.com/smartphone.jpg"
            },
            "quantity": 2,
            "variant": {
              "color": "Black",
              "storage": "128GB"
            },
            "price": 45000,
            "totalPrice": 90000
          }
        ],
        "subtotal": 90000,
        "discount": 9000,
        "total": 81000,
        "status": "delivered",
        "address": {
          "houseDetails": "Flat 101, Building A",
          "streetAddress": "MG Road",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001",
          "country": "India"
        },
        "createdAt": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "orderNumber": "ORD-0987654321",
        "user": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Jane Smith",
          "mobileNumber": "+919876543211"
        },
        "items": [
          {
            "product": {
              "_id": "60d21b4667d0d8992e610c86",
              "name": "Laptop Pro",
              "mainImage": "https://example.com/laptop.jpg"
            },
            "quantity": 1,
            "variant": {
              "color": "Silver",
              "ram": "16GB",
              "storage": "512GB"
            },
            "price": 75000,
            "totalPrice": 75000
          }
        ],
        "subtotal": 75000,
        "discount": 0,
        "total": 75000,
        "status": "shipped",
        "address": {
          "houseDetails": "Office 202, Building B",
          "streetAddress": "SV Road",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400002",
          "country": "India"
        },
        "createdAt": "2023-01-02T12:00:00.000Z"
      }
    ]
  }
}
```
