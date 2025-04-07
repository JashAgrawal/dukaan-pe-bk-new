# Dukaan-Pe Backend

A scalable MongoDB, Express, TypeScript backend application.

## Features

- TypeScript for type safety
- MongoDB with Mongoose for data storage
- Express for API routing
- JWT authentication
- Role-based access control
- Error handling middleware
- Request validation with Joi
- Logging system
- Environment configuration

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Custom middleware functions
│   ├── models/         # MongoDB schema models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── validators/     # Request validation schemas
│   └── app.ts          # Application entry point
├── tests/              # Test files
├── logs/               # Application logs
├── dist/               # Compiled JavaScript code
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile (protected)

## License

ISC
