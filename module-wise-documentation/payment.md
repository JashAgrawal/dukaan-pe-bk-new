# Payment API

The Payment API allows users to process payments for orders using Razorpay.

## Base URL

All API endpoints are prefixed with:

```
/api/payments
```

## Endpoints

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
  "orderId": "60d21b4667d0d8992e610c85"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "razorpayOrder": {
      "id": "order_123456789",
      "entity": "order",
      "amount": 81000,
      "amount_paid": 0,
      "amount_due": 81000,
      "currency": "INR",
      "receipt": "ORD-1234567890",
      "status": "created",
      "attempts": 0,
      "notes": {
        "orderId": "60d21b4667d0d8992e610c85"
      },
      "created_at": 1609502400
    },
    "order": {
      "_id": "60d21b4667d0d8992e610c85",
      "orderNumber": "ORD-1234567890",
      "total": 81000
    },
    "key": "rzp_test_1234567890"
  }
}
```

### Verify Payment

```
POST /api/payments/verify-payment
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": "60d21b4667d0d8992e610c85",
  "razorpayOrderId": "order_123456789",
  "razorpayPaymentId": "pay_123456789",
  "razorpaySignature": "signature_123456789"
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
      "paymentStatus": "paid",
      "paymentDetails": {
        "razorpayOrderId": "order_123456789",
        "razorpayPaymentId": "pay_123456789",
        "razorpaySignature": "signature_123456789"
      },
      "status": "processing",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2023-01-01T12:00:00.000Z"
        },
        {
          "status": "processing",
          "timestamp": "2023-01-01T13:00:00.000Z"
        }
      ],
      "updatedAt": "2023-01-01T13:00:00.000Z"
    }
  }
}
```

### Get Payment Details for Order

```
GET /api/payments/order/:orderId
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
    "payment": {
      "orderId": "60d21b4667d0d8992e610c85",
      "orderNumber": "ORD-1234567890",
      "amount": 81000,
      "paymentMethod": "razorpay",
      "paymentStatus": "paid",
      "paymentDetails": {
        "razorpayOrderId": "order_123456789",
        "razorpayPaymentId": "pay_123456789",
        "razorpaySignature": "signature_123456789"
      },
      "paidAt": "2023-01-01T13:00:00.000Z"
    }
  }
}
```
