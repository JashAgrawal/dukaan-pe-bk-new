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
  "cartId": "60d21b4667d0d8992e610c85",
  "paymentType": "cod",
  "deliveryAddressId": "60d21b4667d0d8992e610c86",
  "isDelivery": true,
  "deliveryType": "home_delivery",
  "specialNoteBuyer": "Please deliver after 6 PM",
  "specialNoteSeller": "Fragile items, handle with care",
  "systemNote": "Order placed via mobile app"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "60d21b4667d0d8992e610c85",
      "orderNumber": "#230615-0001",
      "user": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c86",
      "items": [
        {
          "product": "60d21b4667d0d8992e610c87",
          "quantity": 2,
          "price": 45000,
          "discountedPrice": 40000,
          "totalPrice": 80000,
          "status": "active"
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
      "paymentType": "cod",
      "paymentStatus": "pending",
      "totalWithoutDiscount": 90000,
      "totalPayableAmount": 80000,
      "totalDiscount": 10000,
      "couponDiscount": 5000,
      "offerDiscount": 5000,
      "deliveryCharges": 0,
      "orderStatus": "pending",
      "specialNoteBuyer": "Please deliver after 6 PM",
      "specialNoteSeller": "Fragile items, handle with care",
      "systemNote": "Order placed via mobile app",
      "isDelivery": true,
      "deliveryType": "home_delivery",
      "deliveryAddressId": "60d21b4667d0d8992e610c86",
      "isActive": true,
      "createdAt": "2023-06-15T12:00:00.000Z",
      "updatedAt": "2023-06-15T12:00:00.000Z"
    },
    "paymentDetails": null
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
- `status` (optional): Filter by order status (pending, confirmed, processing, shipped, delivered, cancelled, returned, partially_cancelled, partially_returned)

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "orderNumber": "#230615-0001",
        "user": "60d21b4667d0d8992e610c85",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo.jpg"
        },
        "items": [
          {
            "product": "60d21b4667d0d8992e610c87",
            "quantity": 2,
            "price": 45000,
            "discountedPrice": 40000,
            "totalPrice": 80000,
            "status": "active"
          }
        ],
        "paymentType": "cod",
        "paymentStatus": "pending",
        "totalPayableAmount": 80000,
        "orderStatus": "pending",
        "isDelivery": true,
        "deliveryType": "home_delivery",
        "deliveryTrackingId": {
          "currentStatus": "pending"
        },
        "createdAt": "2023-06-15T12:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "orderNumber": "#230616-0001",
        "user": "60d21b4667d0d8992e610c85",
        "store": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Electronics Hub",
          "logo": "https://example.com/logo.jpg"
        },
        "items": [
          {
            "product": "60d21b4667d0d8992e610c88",
            "quantity": 1,
            "price": 75000,
            "discountedPrice": 75000,
            "totalPrice": 75000,
            "status": "active"
          }
        ],
        "paymentType": "upi",
        "paymentStatus": "captured",
        "totalPayableAmount": 75000,
        "orderStatus": "confirmed",
        "isDelivery": false,
        "deliveryType": "pickup",
        "deliveryTrackingId": {
          "currentStatus": "processing"
        },
        "createdAt": "2023-06-16T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "pages": 1
    }
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
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "orderNumber": "#230615-0001",
    "cartSnapshot": {
      "_id": "60d21b4667d0d8992e610c88",
      "originalCartId": "60d21b4667d0d8992e610c89",
      "user": "60d21b4667d0d8992e610c85",
      "store": "60d21b4667d0d8992e610c86",
      "items": [
        {
          "product": "60d21b4667d0d8992e610c87",
          "quantity": 2,
          "price": 45000,
          "effectivePrice": 40000
        }
      ],
      "totalAmount": 90000,
      "totalDiscount": 10000,
      "couponDiscount": 5000,
      "offerDiscount": 5000,
      "deliveryCharges": 0,
      "payableAmount": 80000
    },
    "user": "60d21b4667d0d8992e610c85",
    "store": "60d21b4667d0d8992e610c86",
    "items": [
      {
        "product": "60d21b4667d0d8992e610c87",
        "quantity": 2,
        "price": 45000,
        "discountedPrice": 40000,
        "totalPrice": 80000,
        "status": "active"
      }
    ],
    "paymentType": "cod",
    "paymentStatus": "pending",
    "totalWithoutDiscount": 90000,
    "totalPayableAmount": 80000,
    "totalDiscount": 10000,
    "couponDiscount": 5000,
    "offerDiscount": 5000,
    "deliveryCharges": 0,
    "orderStatus": "pending",
    "specialNoteBuyer": "Please deliver after 6 PM",
    "specialNoteSeller": "Fragile items, handle with care",
    "systemNote": "Order placed via mobile app",
    "isDelivery": true,
    "deliveryType": "home_delivery",
    "deliveryAddressId": {
      "_id": "60d21b4667d0d8992e610c86",
      "user": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "mobileNumber": "+919876543210",
      "addressLine1": "123, Main Street",
      "addressLine2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India",
      "isDefault": true
    },
    "deliveryTrackingId": {
      "_id": "60d21b4667d0d8992e610c90",
      "order": "60d21b4667d0d8992e610c85",
      "currentStatus": "pending",
      "statusUpdates": [
        {
          "status": "pending",
          "timestamp": "2023-06-15T12:00:00.000Z",
          "description": "Order has been placed"
        }
      ]
    },
    "isActive": true,
    "createdAt": "2023-06-15T12:00:00.000Z",
    "updatedAt": "2023-06-15T12:00:00.000Z"
  }
}
```

### Update Order Status

```
PATCH /api/orders/:id/status
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "confirmed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "orderNumber": "#230615-0001",
    "orderStatus": "confirmed",
    "updatedAt": "2023-06-15T14:00:00.000Z"
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
  "message": "Order cancelled successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "orderNumber": "#230615-0001",
    "orderStatus": "cancelled",
    "cancelledAt": "2023-06-15T15:00:00.000Z",
    "cancelReason": "Changed my mind"
  }
}
```

### Cancel Order Items

```
POST /api/orders/:id/cancel-items
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "items": [0],
  "reason": "Product no longer needed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "orderNumber": "#230615-0001",
    "orderStatus": "partially_cancelled",
    "items": [
      {
        "product": "60d21b4667d0d8992e610c87",
        "quantity": 2,
        "price": 45000,
        "discountedPrice": 40000,
        "totalPrice": 80000,
        "status": "cancelled",
        "cancelledAt": "2023-06-15T16:00:00.000Z",
        "cancelReason": "Product no longer needed"
      }
    ]
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
- `status` (optional): Filter by order status (pending, confirmed, processing, shipped, delivered, cancelled, returned, partially_cancelled, partially_returned)

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "orderNumber": "#230615-0001",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "items": [
          {
            "product": "60d21b4667d0d8992e610c87",
            "quantity": 2,
            "price": 45000,
            "discountedPrice": 40000,
            "totalPrice": 80000,
            "status": "active"
          }
        ],
        "paymentType": "cod",
        "paymentStatus": "pending",
        "totalPayableAmount": 80000,
        "orderStatus": "pending",
        "isDelivery": true,
        "deliveryType": "home_delivery",
        "deliveryTrackingId": {
          "currentStatus": "pending"
        },
        "deliveryAddressId": {
          "name": "John Doe",
          "mobileNumber": "+919876543210",
          "addressLine1": "123, Main Street",
          "addressLine2": "Apartment 4B",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001",
          "country": "India"
        },
        "createdAt": "2023-06-15T12:00:00.000Z"
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
