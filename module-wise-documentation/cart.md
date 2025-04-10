# Cart API

The Cart API allows users to manage their shopping cart.

## Base URL

All API endpoints are prefixed with:

```
/api/cart
```

## Endpoints

### Get User's Cart

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
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c86",
          "product": {
            "_id": "60d21b4667d0d8992e610c85",
            "name": "Smartphone X",
            "mainImage": "https://example.com/smartphone.jpg",
            "price": 50000,
            "sellingPrice": 45000,
            "discountPercentage": 10,
            "store": {
              "_id": "60d21b4667d0d8992e610c86",
              "name": "Electronics Hub"
            },
            "inventory": 50
          },
          "quantity": 1,
          "variant": {
            "color": "Black",
            "storage": "128GB"
          },
          "price": 45000,
          "totalPrice": 45000
        },
        {
          "_id": "60d21b4667d0d8992e610c87",
          "product": {
            "_id": "60d21b4667d0d8992e610c86",
            "name": "Laptop Pro",
            "mainImage": "https://example.com/laptop.jpg",
            "price": 80000,
            "sellingPrice": 75000,
            "discountPercentage": 6.25,
            "store": {
              "_id": "60d21b4667d0d8992e610c86",
              "name": "Electronics Hub"
            },
            "inventory": 25
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
      "coupon": null,
      "subtotal": 120000,
      "discount": 0,
      "total": 120000,
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
  "variant": {
    "color": "Black",
    "storage": "128GB"
  }
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
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c86",
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 1,
          "variant": {
            "color": "Black",
            "storage": "128GB"
          },
          "price": 45000,
          "totalPrice": 45000
        }
      ],
      "coupon": null,
      "subtotal": 45000,
      "discount": 0,
      "total": 45000,
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update Item in Cart

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
  "itemId": "60d21b4667d0d8992e610c86",
  "quantity": 2
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
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c86",
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
      "coupon": null,
      "subtotal": 90000,
      "discount": 0,
      "total": 90000,
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
  "itemId": "60d21b4667d0d8992e610c86"
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
      "items": [],
      "coupon": null,
      "subtotal": 0,
      "discount": 0,
      "total": 0,
      "updatedAt": "2023-01-01T14:00:00.000Z"
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
      "user": "60d21b4667d0d8992e610c85",
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c86",
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
      "coupon": {
        "code": "WELCOME10",
        "discount": 10,
        "discountType": "percentage"
      },
      "subtotal": 90000,
      "discount": 9000,
      "total": 81000,
      "updatedAt": "2023-01-01T15:00:00.000Z"
    }
  }
}
```

### Remove Coupon from Cart

```
DELETE /api/cart/remove-coupon
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
      "items": [
        {
          "_id": "60d21b4667d0d8992e610c86",
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
      "coupon": null,
      "subtotal": 90000,
      "discount": 0,
      "total": 90000,
      "updatedAt": "2023-01-01T16:00:00.000Z"
    }
  }
}
```
