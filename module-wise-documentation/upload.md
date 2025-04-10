# Upload API

The Upload API allows users to upload images to the platform.

## Base URL

All API endpoints are prefixed with:

```
/api/upload
```

## Endpoints

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

```
image: <file>
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "imageUrl": "https://example.com/uploads/images/image-1234567890.jpg"
  }
}
```

**Notes:**

- The uploaded image is stored in a public static folder on the server
- The API returns the URL of the uploaded image that can be used to access it
- Supported image formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Images are optimized for web use automatically
- The URL returned is absolute and can be used directly in frontend applications
