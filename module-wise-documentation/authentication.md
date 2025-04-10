# Authentication API

The Authentication API allows users to register, login, and manage their profiles using mobile number and OTP verification.

## Base URL

All API endpoints are prefixed with:

```
/api/auth
```

## Endpoints

### Request OTP

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
    "otpSentAt": "2023-01-01T12:00:00.000Z"
  }
}
```

**Note:** In the development environment, the OTP is printed to the console instead of being sent via SMS.

### Verify OTP

```
POST /api/auth/verify-otp
```

**Request Body:**

```json
{
  "mobileNumber": "+919876543210",
  "otp": "123456"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "mobileNumber": "+919876543210",
      "role": "user",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Get Current User Profile

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
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "mobileNumber": "+919876543210",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
}
```

### Update User Profile

```
PATCH /api/auth/me
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Smith",
      "mobileNumber": "+919876543210",
      "email": "johnsmith@example.com",
      "role": "user",
      "updatedAt": "2023-01-01T13:00:00.000Z"
    }
  }
}
```
