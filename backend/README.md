# Backend API

Production-ready Node.js/Express backend with TypeScript, MongoDB, JWT authentication, and Swagger documentation.

## Features

- ✅ **Expense Tracker** - Comprehensive expense management with custom categories
- ✅ **Real-time Chat** - Private/group messaging via Socket.IO
- ✅ **Shoutbox** - Global real-time chat window
- ✅ **Weather API** - Live weather data with multi-provider fallback
- ✅ **URL Shortener** - URL management and redirection tracking
- ✅ **Analytics** - Global and user-level activity statistics
- ✅ **Image Upload** - Cloudinary integration for profile/group images
- ✅ **Email System** - Support for Resend and Nodemailer (SMTP)
- ✅ **Redis** - Upstash Redis integration for caching and OTP
- ✅ **API Documentation** - Swagger/OpenAPI documentation
- ✅ **Quality Control** - Jest testing and Zod validation

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret

# Run in development
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── common/          # Shared utilities
│   │   ├── db/          # Database connection
│   │   ├── errors/      # Custom error classes
│   │   └── utils/       # Helper functions
│   ├── config/          # Configuration
│   │   ├── index.ts     # Environment config
│   │   └── swagger.ts   # API documentation config
│   ├── middleware/      # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   └── services/        # Business logic by service
│       ├── auth/        # Authentication service
│       │   ├── auth.model.ts
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.routes.ts
│       │   └── auth.validation.ts
│       └── todo/        # TODO service (example)
│           ├── todo.model.ts
│           ├── todo.service.ts
│           ├── todo.controller.ts
│           ├── todo.routes.ts
│           └── todo.validation.ts
├── __tests__/           # Test files
│   ├── setup.ts
│   └── e2e/
├── app.ts               # Express app setup
├── server.ts            # Server entry point
└── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Chat & Shoutbox
- `GET /api/chat/conversations` - Get all conversations
- `POST /api/chat/messages` - Send message
- `GET /api/shoutbox` - Get shoutbox history
- `POST /api/shoutbox` - Post to shoutbox

### Expense Tracker
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/categories` - Get custom categories
- `POST /api/expenses/categories` - Create category

### Weather & Utils
- `GET /api/weather` - Get live weather
- `POST /api/url/shorten` - Shorten URL
- `GET /api/url/stats/:id` - Get URL click stats
- `GET /api/analytics` - Global system stats

## Environment Variables

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

- node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run unit tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run E2E tests

## Adding a New Service

See [Creating New Service Guide](../docs/CREATING_NEW_SERVICE.md) for step-by-step instructions.

## Deployment

See [Deployment Guide](../docs/DEPLOYMENT.md) for deployment instructions.
