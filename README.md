# Nexus Monorepo

A production-ready, type-safe fullstack monorepo with **Backend (Node.js/Express/MongoDB)**, **Web (Next.js)**, and **Mobile (React Native/Expo)** applications. Built with TypeScript, featuring complete authentication flows, real-time capabilities, and shared type safety across all platforms.

**Nexus** - Full-Stack MERN Application showcasing MongoDB, Express.js, React, and Node.js with TypeScript.

## 🚀 Features

### Backend
- ✅ **TypeScript** - Full type safety with path aliases
- ✅ **Authentication** - JWT with bcrypt password hashing
- ✅ **Email Verification** - 6-digit OTP via Nodemailer
- ✅ **Refresh Tokens** - Long-lived tokens with rotation
- ✅ **Password Reset** - Secure OTP-based flow
- ✅ **Redis Caching** - ioredis with TLS support
- ✅ **WebSocket** - Real-time notifications with Socket.IO
- ✅ **Validation** - Zod schemas for request validation
- ✅ **API Docs** - Swagger/OpenAPI at `/api-docs`
- ✅ **Testing** - Jest + Supertest E2E tests
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **TODO Service** - Complete CRUD example with user scoping

### Shared Module
- ✅ **Types** - Shared TypeScript interfaces across all apps
- ✅ **Validation** - Reusable Zod schemas
- ✅ **Constants** - API endpoints, error messages
- ✅ **Utils** - Common helper functions

### Web
- ✅ **Next.js 16** - App Router with React 19
- ✅ **TailwindCSS 4** - Modern styling with PostCSS
- ✅ **TypeScript** - Full type safety
- ✅ **ESLint** - Code quality and consistency

### Mobile
- ✅ **React Native** - Expo SDK 54
- ✅ **Navigation** - React Navigation with bottom tabs and stack
- ✅ **State Management** - Zustand with MMKV persistence
- ✅ **Forms** - React Hook Form + Zod validation
- ✅ **UI Components** - React Native Paper
- ✅ **Authentication** - Complete auth flow (login, register, verify, reset)
- ✅ **TODO Management** - Full CRUD with optimistic updates
- ✅ **TypeScript** - Shared types from monorepo

## 📁 Project Structure

```
nexus-monorepo/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── common/       # Shared utilities (db, services)
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Express middleware
│   │   └── services/     # Business logic (auth, todos, etc.)
│   ├── __tests__/        # Test files
│   ├── server.ts         # Entry point
│   ├── app.ts            # Express app setup
│   └── package.json
├── shared/               # Shared types & validation
│   ├── src/
│   │   ├── types/        # TypeScript interfaces
│   │   ├── validation/   # Zod schemas
│   │   ├── constants/    # Shared constants
│   │   └── utils/        # Helper functions
│   └── package.json
├── web/                  # Next.js application
│   ├── app/              # App router pages
│   ├── public/           # Static assets
│   └── package.json
├── mobile/               # React Native (Expo) app
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   ├── screens/      # Screen components
│   │   ├── store/        # Zustand stores
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Helper functions
│   ├── index.ts          # Entry point
│   └── package.json
└── docs/                 # Documentation
    ├── ADVANCED_AUTH.md
    ├── CREATING_NEW_SERVICE.md
    └── DEPLOYMENT.md
```

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- Yarn (recommended) or npm
- For mobile: Expo Go app on your phone or Android/iOS emulator

### Installation

This repository is configured so that **each project maintains its own `node_modules`** folder instead of using Yarn workspaces. This ensures proper dependency isolation, especially important for React Native/Expo.

#### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-master-repo

# Run the setup script
./setup.sh
```

The setup script will:
1. Clean all existing `node_modules`
2. Install dependencies for each project (shared, backend, web, mobile)
3. Build the shared package
4. Verify all installations

#### Option 2: Manual Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-master-repo

# Install all projects at once
yarn install:all

# Or install individually:
cd shared && yarn install && yarn build && cd ..
cd backend && yarn install && cd ..
cd web && yarn install && cd ..
cd mobile && yarn install && cd ..
```

> **📖 For detailed installation instructions, troubleshooting, and best practices, see [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)**

### 2. Backend Setup


```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration:
# - MongoDB URI
# - JWT secrets
# - Email credentials (for OTP)
# - Redis URL (optional)

# Run development server
npm run dev

# API will be available at http://localhost:8000
# Swagger docs at http://localhost:8000/api-docs
```

### 3. Web Setup

```bash
# Navigate to web (in a new terminal)
cd web

# Install dependencies
npm install

# Run development server
npm run dev

# Web app will be available at http://localhost:3000
```

### 4. Mobile Setup

```bash
# Navigate to mobile (in a new terminal)
cd mobile

# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

### Run Tests

```bash
cd backend
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:watch    # Watch mode
```

## 🔧 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server
PORT=8000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/nexus
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Redis (Upstash - for OTP and caching)
# Get your Redis URL from https://upstash.com/redis
# Format: rediss://default:PASSWORD@HOST:PORT
REDIS_DATABASE_URI=rediss://default:your-password@your-host.upstash.io:6379

# Email (for OTP delivery)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@nexus.app

# OTP Configuration
OTP_EXPIRY_MINUTES=10
```

### Mobile (src/api/config.ts)

Update the API base URL in `mobile/src/api/config.ts`:

```typescript
// For iOS simulator
export const API_BASE_URL = 'http://localhost:8000';

// For Android emulator
export const API_BASE_URL = 'http://10.0.2.2:8000';

// For physical device (use your computer's IP)
export const API_BASE_URL = 'http://192.168.x.x:8000';
```

## 📱 Mobile Application Features

The React Native mobile app includes a complete, production-ready implementation:

### Authentication Flow
- **Registration** - Create account with email and password
- **Email Verification** - 6-digit OTP verification
- **Login** - Secure JWT-based authentication
- **Password Reset** - OTP-based password recovery
- **Persistent Sessions** - Auto-login with MMKV storage
- **Token Refresh** - Automatic token refresh handling

### TODO Management
- **Create TODOs** - Add tasks with title, description, priority, and due date
- **View TODOs** - List all tasks with filtering and sorting
- **Update TODOs** - Edit task details and mark as complete
- **Delete TODOs** - Remove individual or all tasks
- **Optimistic Updates** - Instant UI feedback with rollback on error
- **User-Scoped Data** - Each user sees only their own tasks

### Technical Features
- **Type-Safe API Client** - Axios with TypeScript interfaces
- **Form Validation** - React Hook Form + Zod schemas
- **State Management** - Zustand stores with MMKV persistence
- **Navigation** - Stack and bottom tab navigation
- **Error Handling** - User-friendly error messages
- **Loading States** - Proper loading indicators throughout

### Screens
- Login Screen
- Register Screen
- Email Verification Screen
- Forgot Password Screen
- Reset Password Screen
- Home Screen (TODO list)
- Profile Screen

## �📚 Documentation

- [Backend Setup](./backend/README.md)
- [Advanced Authentication](./docs/ADVANCED_AUTH.md)
- [Creating New Service](./docs/CREATING_NEW_SERVICE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](http://localhost:8000/api-docs) (when running)

## 🔐 Authentication

The monorepo includes a complete, production-ready JWT-based authentication system:

### Features
- **User Registration** - Password hashing with bcrypt (10 rounds)
- **Email Verification** - 6-digit OTP sent via email
- **Login** - JWT access token (15min) + refresh token (7 days)
- **Token Refresh** - Automatic token rotation
- **Password Reset** - Secure OTP-based flow
- **Protected Routes** - Authentication middleware
- **User Profile** - Get and update user information

### API Endpoints

```
POST   /api/auth/register              # Register new user
POST   /api/auth/verify-email          # Verify email with OTP
POST   /api/auth/resend-verification   # Resend verification OTP
POST   /api/auth/login                 # Login user
POST   /api/auth/refresh-token         # Refresh access token
POST   /api/auth/forgot-password       # Request password reset OTP
POST   /api/auth/reset-password        # Reset password with OTP
GET    /api/auth/me                    # Get current user (protected)
PUT    /api/auth/me                    # Update user profile (protected)
POST   /api/auth/logout                # Logout user (protected)
```

### Example Usage

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234","name":"Test User"}'

# Verify Email
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234"}'
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 TODO Service Example

The boilerplate includes a complete TODO service as a reference implementation:

- CRUD operations (Create, Read, Update, Delete)
- User-scoped data (each user sees only their TODOs)
- Pagination and filtering
- Priority levels and due dates
- Full test coverage

### API Endpoints

```
POST   /api/todos          # Create TODO
GET    /api/todos          # Get all TODOs (paginated)
GET    /api/todos/:id      # Get TODO by ID
PUT    /api/todos/:id      # Update TODO
DELETE /api/todos/:id      # Delete TODO
DELETE /api/todos          # Delete all TODOs
```

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

Test coverage includes:
- Authentication flow (register, login, protected routes)
- TODO CRUD operations
- Validation and error handling
- User-scoped data access

## 🚢 Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions on deploying to:
- Render
- Railway
- Heroku
- Docker
- VPS (DigitalOcean, AWS EC2)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21+
- **Database**: MongoDB with Mongoose 9.0+
- **Cache**: Redis with ioredis 5.3+
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer 6.9+
- **WebSocket**: Socket.IO 4.6+
- **Validation**: Zod 3.22+
- **Testing**: Jest 29+ + Supertest
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, rate limiting

### Shared
- **Language**: TypeScript 5.9+
- **Validation**: Zod
- **Build**: TypeScript Compiler

### Web
- **Framework**: Next.js 16
- **React**: React 19
- **Styling**: TailwindCSS 4 with PostCSS
- **Language**: TypeScript 5+
- **Linting**: ESLint 9

### Mobile
- **Framework**: React Native 0.81 with Expo 54
- **React**: React 19
- **Navigation**: React Navigation 7
- **State**: Zustand 5 with MMKV 4 persistence
- **Forms**: React Hook Form 7 + Zod 4
- **UI**: React Native Paper 5
- **HTTP**: Axios 1.13+
- **Language**: TypeScript 5.9+

## 📖 Learning Resources

This monorepo demonstrates modern fullstack development practices:

1. **Monorepo Architecture** - Shared code across backend, web, and mobile
2. **Type Safety** - End-to-end TypeScript with shared types
3. **Authentication** - Complete JWT-based auth with email verification
4. **State Management** - Zustand with persistence (MMKV for mobile)
5. **Validation** - Schema validation with Zod across all platforms
6. **Testing** - Unit and E2E testing strategies
7. **API Documentation** - Swagger/OpenAPI best practices
8. **Error Handling** - Centralized error management
9. **Path Aliases** - Clean import statements with TypeScript
10. **Real-time Communication** - WebSocket integration with Socket.IO
11. **Mobile Development** - React Native with Expo and navigation
12. **Form Handling** - React Hook Form with Zod validation

## 🤝 Contributing

This is a learning-focused monorepo. Contributions welcome:
- Add new backend services following the TODO example
- Enhance web and mobile UI/UX
- Improve documentation
- Add more tests (backend, web, mobile)
- Suggest best practices for monorepo management
- Add new features to any of the three apps

## 📄 License

MIT

## 🙏 Acknowledgments

Built with best practices from:
- Express.js documentation
- MongoDB best practices
- TypeScript handbook
- Jest testing library
- Swagger/OpenAPI specification
- Next.js documentation
- React Native and Expo guides
- React Navigation documentation
- Zustand state management patterns
