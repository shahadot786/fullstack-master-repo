# Nexus Fullstack Monorepo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready, type-safe fullstack monorepo template featuring **Backend (Node.js/Express/MongoDB)**, **Web (Next.js)**, and **Mobile (React Native/Expo)** applications. Built with TypeScript, featuring complete authentication flows, real-time capabilities, and shared type safety across all platforms.

**Perfect for**: Learning fullstack development, starting new projects, or as a reference implementation for modern MERN stack applications.

---

## 📸 Screenshots

### Web Application

<details>
<summary>Click to view screenshots</summary>

#### Registration Page
![Registration](./docs/images/web-register.png)

#### Todo Dashboard (Dark Mode)
![Todo Dashboard](./docs/images/web-todo-dashboard.png)

#### Create Todo Dialog
![Create Todo](./docs/images/web-todo-create.png)

</details>

### Mobile Application

<details>
<summary>Click to view screenshots</summary>

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <h4 align="center">Login Screen</h4>
        <a href="./docs/images/mobile-login.png">
          <img src="./docs/images/mobile-login.png" width="100%" style="max-height: 400px; object-fit: contain;" alt="Login Screen">
        </a>
      </td>
      <td width="50%">
        <h4 align="center">Navigation Drawer</h4>
        <a href="./docs/images/mobile-drawer.png">
          <img src="./docs/images/mobile-drawer.png" width="100%" style="max-height: 400px; object-fit: contain;" alt="Navigation Drawer">
        </a>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <h4 align="center">Todo List (Light Mode)</h4>
        <a href="./docs/images/mobile-todos-light.png">
          <img src="./docs/images/mobile-todos-light.png" width="100%" style="max-height: 400px; object-fit: contain;" alt="Todo List Light">
        </a>
      </td>
      <td width="50%">
        <h4 align="center">Todo List (Dark Mode)</h4>
        <a href="./docs/images/mobile-todos-dark.png">
          <img src="./docs/images/mobile-todos-dark.png" width="100%" style="max-height: 400px; object-fit: contain;" alt="Todo List Dark">
        </a>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <h4 align="center">Create Todo Modal</h4>
        <a href="./docs/images/mobile-create-todo.png">
          <img src="./docs/images/mobile-create-todo.png" width="100%" style="max-height: 400px; object-fit: contain;" alt="Create Todo">
        </a>
      </td>
      <td width="50%">
        <h4 align="center">Settings & Profile</h4>
        <a href="./docs/images/mobile-settings.png">
          <img src="./docs/images/mobile-settings.png" width="100%" style="max-height: 400px; object-fit: contain;" alt="Settings">
        </a>
      </td>
    </tr>
  </table>
</div>

</details>

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Status](#-project-status)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Docker Setup](#-docker-setup)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Documentation](#-documentation)
- [Tech Stack](#️-tech-stack)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### Backend (Node.js/Express)

#### ✅ Production-Ready Features
- **TypeScript** - Full type safety with path aliases (`@common`, `@services`, etc.)
- **Authentication Service** - Complete JWT-based auth system
  - User registration with email verification (6-digit OTP)
  - Login with access tokens (15min) and refresh tokens (7 days)
  - Password reset flow with OTP
  - Token refresh and rotation
  - Protected routes with middleware
- **TODO Service** - Full CRUD example with user scoping
- **Redis Caching** - Upstash Redis integration with TLS support
- **WebSocket** - Real-time notifications with Socket.IO
- **Validation** - Zod schemas for request validation
- **API Documentation** - Swagger/OpenAPI at `/api-docs`
- **Testing** - Jest + Supertest E2E tests with 80%+ coverage
- **Security** - Helmet, CORS, rate limiting, bcrypt password hashing
- **Email Service** - Nodemailer integration for OTP delivery

#### 🚧 Placeholder Services (Ready for Implementation)
The monorepo includes placeholder service directories for common application features:
- `aiqa` - AI/QA service
- `chat` - Real-time chat
- `delivery` - Delivery tracking
- `expense` - Expense management
- `notes` - Note-taking
- `shop` - E-commerce
- `social` - Social features
- `urlshort` - URL shortener
- `weather` - Weather service

> See [Creating New Service Guide](./docs/CREATING_NEW_SERVICE.md) to implement these services.

### Shared Package

- **Types** - Shared TypeScript interfaces across all apps
- **Validation** - Reusable Zod schemas for consistent validation
- **Constants** - API endpoints, error messages, HTTP status codes
- **Utils** - Common helper functions

### Web Application (Next.js)

- **Next.js 16** - Latest App Router with React 19
- **Modern UI** - TailwindCSS 4 with Radix UI primitives
- **Authentication Pages** - Login, register, email verification, password reset
- **Dashboard Layout** - Responsive sidebar navigation with theme toggle
- **Feature Modules** - 11 feature pages matching backend services
  - Todos (fully functional)
  - Profile management
  - Placeholder pages for all services (aiqa, chat, delivery, expense, notes, shop, social, urlshort, weather)
- **State Management** - Zustand stores with React Query for server state
- **Form Handling** - React Hook Form with Zod validation
- **Real-time Updates** - Socket.IO client integration
- **Theme Support** - Dark/light mode with next-themes
- **Type Safety** - Full TypeScript with shared types from monorepo

### Mobile Application (React Native/Expo)

- **Expo SDK 54** - Latest Expo with React Native 0.81
- **Navigation** - Expo Router with file-based routing
- **Complete Auth Flow** - All authentication screens
  - Login, Register, Email Verification
  - Forgot Password, Reset Password
  - Persistent sessions with MMKV storage
- **TODO Management** - Full CRUD with optimistic updates
- **UI Components** - Tamagui + React Native Paper
- **State Management** - Zustand with MMKV persistence
- **Forms** - React Hook Form + Zod validation
- **API Client** - Axios with TypeScript interfaces
- **Error Handling** - User-friendly error messages
- **Loading States** - Proper loading indicators throughout

---

## 📊 Project Status

### Fully Implemented ✅
- **Backend**: Authentication service, TODO service, WebSocket, Redis caching
- **Web**: Auth pages, dashboard layout, todos page, profile page
- **Mobile**: Complete auth flow, todo management, profile screen
- **Shared**: Types, validation schemas, constants, utilities

### Ready for Implementation 🚧
- 9 backend service placeholders with corresponding web/mobile pages
- Additional features: notifications, file uploads, search, analytics

### Documentation 📚
- ✅ Advanced authentication guide
- ✅ Service creation tutorial
- ✅ Deployment guide
- ✅ Architecture documentation
- ✅ Project structure guide

---

## 📁 Project Structure

```
fullstack-master-repo/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── common/             # Shared utilities
│   │   │   ├── db/             # Database connection
│   │   │   ├── errors/         # Custom error classes
│   │   │   ├── services/       # Common services (email, redis, websocket)
│   │   │   └── utils/          # Helper functions
│   │   ├── config/             # Configuration
│   │   │   ├── index.ts        # Environment config
│   │   │   └── swagger.ts      # API documentation config
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   └── services/           # Business logic by service
│   │       ├── auth/           # ✅ Authentication (IMPLEMENTED)
│   │       ├── todo/           # ✅ TODO CRUD (IMPLEMENTED)
│   │       ├── aiqa/           # 🚧 Placeholder
│   │       ├── chat/           # 🚧 Placeholder
│   │       ├── delivery/       # 🚧 Placeholder
│   │       ├── expense/        # 🚧 Placeholder
│   │       ├── notes/          # 🚧 Placeholder
│   │       ├── shop/           # 🚧 Placeholder
│   │       ├── social/         # 🚧 Placeholder
│   │       ├── urlshort/       # 🚧 Placeholder
│   │       └── weather/        # 🚧 Placeholder
│   ├── __tests__/              # Test files
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Server entry point
│   └── package.json
│
├── shared/                     # Shared types & validation
│   ├── src/
│   │   ├── types/              # TypeScript interfaces
│   │   ├── validation/         # Zod schemas
│   │   ├── constants/          # Shared constants
│   │   └── utils/              # Helper functions
│   └── package.json
│
├── web/                        # Next.js application
│   ├── app/
│   │   ├── (auth)/             # Auth pages (login, register, verify, reset)
│   │   ├── (dashboard)/        # Dashboard with sidebar
│   │   │   ├── todos/          # ✅ TODO management (IMPLEMENTED)
│   │   │   ├── profile/        # ✅ User profile (IMPLEMENTED)
│   │   │   ├── aiqa/           # 🚧 Placeholder page
│   │   │   ├── chat/           # 🚧 Placeholder page
│   │   │   ├── delivery/       # 🚧 Placeholder page
│   │   │   ├── expense/        # 🚧 Placeholder page
│   │   │   ├── notes/          # 🚧 Placeholder page
│   │   │   ├── shop/           # 🚧 Placeholder page
│   │   │   ├── social/         # 🚧 Placeholder page
│   │   │   ├── urlshort/       # 🚧 Placeholder page
│   │   │   └── weather/        # 🚧 Placeholder page
│   │   ├── layout.tsx          # Root layout
│   │   └── providers.tsx       # React Query & theme providers
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities and API client
│   ├── public/                 # Static assets
│   └── package.json
│
├── mobile/                     # React Native (Expo) app
│   ├── app/                    # Expo Router screens
│   │   ├── (auth)/             # Auth screens
│   │   ├── (tabs)/             # Tab navigation
│   │   └── _layout.tsx         # Root layout
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # Reusable components
│   │   ├── hooks/              # Custom hooks
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Helper functions
│   └── package.json
│
└── docs/                       # Documentation
    ├── ADVANCED_AUTH.md        # Authentication guide
    ├── ARCHITECTURE.md         # System architecture
    ├── CREATING_NEW_SERVICE.md # Service creation tutorial
    ├── DEPLOYMENT.md           # Deployment guide
    ├── DEVELOPMENT_GUIDE.md    # Developer workflow
    └── PROJECT_STRUCTURE.md    # Detailed structure guide
```

> For detailed structure documentation, see [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)

---

## 🏃 Quick Start

### Prerequisites

#### Option 1: Docker (Recommended)

- **Docker Desktop** 20.10+ ([Download](https://www.docker.com/products/docker-desktop))
  - Includes Docker Engine and Docker Compose
  - All dependencies (MongoDB, Redis) run in containers
  - See [Docker Setup](#-docker-setup) section below

#### Option 2: Local Development

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Yarn** 1.22+ (recommended) or npm
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Redis** - [Upstash Redis](https://upstash.com/redis) (free tier) or local installation
- **For Mobile**: [Expo Go](https://expo.dev/client) app on your phone or Android/iOS emulator

### Installation

This monorepo uses **independent `node_modules`** for each package (not Yarn workspaces) to ensure proper dependency isolation, especially important for React Native/Expo.

#### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-master-repo

# Run the automated setup script
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Clean all existing `node_modules` directories
2. Install dependencies for each package (shared, backend, web, mobile)
3. Build the shared package
4. Verify all installations

#### Option 2: Manual Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-master-repo

# Install all packages at once
yarn install:all

# Or install individually:
cd shared && yarn install && yarn build && cd ..
cd backend && yarn install && cd ..
cd web && yarn install && cd ..
cd mobile && yarn install && cd ..
```

### Running the Applications

#### 1. Start Backend API

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update .env with your configuration:
# - MongoDB URI (local or Atlas)
# - JWT secrets
# - Email credentials (for OTP)
# - Redis URL (Upstash or local)

# Run development server
yarn dev

# API will be available at http://localhost:8000
# Swagger docs at http://localhost:8000/api-docs
```

#### 2. Start Web Application

```bash
# In a new terminal
cd web

# Run development server
yarn dev

# Web app will be available at http://localhost:3000
```

#### 3. Start Mobile Application

```bash
# In a new terminal
cd mobile

# Update API base URL in src/api/config.ts:
# - iOS simulator: http://localhost:8000
# - Android emulator: http://10.0.2.2:8000
# - Physical device: http://YOUR_COMPUTER_IP:8000

# Start Expo
yarn start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

---

## 🐳 Docker Setup

### Quick Start with Docker

The easiest way to run the entire stack is using Docker Compose:

```bash
# 1. Copy environment file
cp .env.docker.example .env.docker

# 2. Edit environment variables (JWT secrets, email, etc.)
nano .env.docker

# 3. Start all services (development mode)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 4. Access the applications
# Web: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api-docs
```

### What's Included

Docker Compose automatically sets up:
- ✅ **Backend API** - Node.js/Express on port 8000
- ✅ **Web Application** - Next.js on port 3000
- ✅ **MongoDB** - Database with persistent storage
- ✅ **Redis** - Cache for OTP and sessions
- ✅ **Networking** - All services connected
- ✅ **Hot Reloading** - Code changes reflect immediately (dev mode)

### Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f web

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Advantages of Docker Setup

- **No Local Dependencies** - No need to install MongoDB, Redis, or Node.js
- **Consistent Environment** - Same setup across all machines
- **Easy Cleanup** - Remove everything with `docker-compose down -v`
- **Production-Ready** - Same configuration works in production

> **For detailed Docker documentation**, see [DOCKER.md](./docs/DOCKER.md)

---

#### Run All Applications Concurrently (Without Docker)

```bash
# From root directory
yarn dev

# This runs: shared (watch mode), backend, and web concurrently
# Mobile must be started separately


---

## 🔧 Environment Variables

### Backend (`.env`)

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=8000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/nexus
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars
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

> **Generate secure JWT secrets:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Mobile (`src/api/config.ts`)

Update the API base URL in `mobile/src/api/config.ts`:

```typescript
// For iOS simulator
export const API_BASE_URL = 'http://localhost:8000';

// For Android emulator
export const API_BASE_URL = 'http://10.0.2.2:8000';

// For physical device (use your computer's local IP)
export const API_BASE_URL = 'http://192.168.x.x:8000';
```

---

## 📜 Available Scripts

### Root Directory

```bash
yarn install:all      # Install dependencies for all packages
yarn build:shared     # Build shared package
yarn build:all        # Build shared, backend, and web
yarn dev              # Run shared (watch), backend, and web concurrently
yarn dev:backend      # Run backend only
yarn dev:web          # Run web only
yarn dev:mobile       # Run mobile only
yarn clean            # Remove all node_modules
yarn test             # Run backend tests
yarn lint             # Lint backend and web
```

### Backend

```bash
yarn dev              # Start development server with hot reload
yarn build            # Build TypeScript to JavaScript
yarn start            # Start production server
yarn test             # Run unit tests with coverage
yarn test:watch       # Run tests in watch mode
yarn test:e2e         # Run E2E tests
```

### Web

```bash
yarn dev              # Start Next.js development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
```

### Mobile

```bash
yarn start            # Start Expo development server
yarn android          # Run on Android emulator
yarn ios              # Run on iOS simulator
yarn web              # Run in web browser
yarn lint             # Run ESLint
```

### Shared

```bash
yarn build            # Build TypeScript to JavaScript
yarn dev              # Build in watch mode
yarn clean            # Remove dist directory
```

---

## 🔐 Authentication

The monorepo includes a complete, production-ready JWT-based authentication system with email verification.

### Features

- **User Registration** - Password hashing with bcrypt (10 rounds)
- **Email Verification** - 6-digit OTP sent via email
- **Login** - JWT access token (15min) + refresh token (7 days)
- **Token Refresh** - Automatic token rotation
- **Password Reset** - Secure OTP-based flow
- **Protected Routes** - Authentication middleware
- **User Profile** - Get and update user information
- **Logout** - Token invalidation

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB
    participant Redis
    participant Email

    User->>Frontend: Register
    Frontend->>Backend: POST /api/auth/register
    Backend->>MongoDB: Create user
    Backend->>Redis: Store OTP
    Backend->>Email: Send OTP
    Backend->>Frontend: Access + Refresh tokens
    Frontend->>User: Check email for OTP

    User->>Frontend: Enter OTP
    Frontend->>Backend: POST /api/auth/verify-email
    Backend->>Redis: Verify OTP
    Backend->>MongoDB: Mark email verified
    Backend->>Frontend: Success
    Frontend->>User: Email verified
```

> For detailed authentication documentation, see [ADVANCED_AUTH.md](./docs/ADVANCED_AUTH.md)

---

## 📝 API Endpoints

### Authentication

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

### TODOs

```
POST   /api/todos          # Create TODO (protected)
GET    /api/todos          # Get all TODOs with pagination (protected)
GET    /api/todos/:id      # Get TODO by ID (protected)
PUT    /api/todos/:id      # Update TODO (protected)
DELETE /api/todos/:id      # Delete TODO (protected)
DELETE /api/todos          # Delete all TODOs (protected)
```

### API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:8000/api-docs`
- **OpenAPI JSON**: `http://localhost:8000/api-docs.json`

---

## 📚 Documentation

- **[DOCKER.md](./docs/DOCKER.md)** - Complete Docker setup and deployment guide
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - Detailed project structure guide
- **[ADVANCED_AUTH.md](./docs/ADVANCED_AUTH.md)** - Authentication features and flows
- **[CREATING_NEW_SERVICE.md](./docs/CREATING_NEW_SERVICE.md)** - Tutorial for creating new services
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide for all platforms
- **[DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)** - Developer workflow and best practices
- **[Backend README](./backend/README.md)** - Backend-specific documentation

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21+
- **Database**: MongoDB with Mongoose 9.0+
- **Cache**: Redis with ioredis 5.3+ (Upstash)
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer 6.9+
- **WebSocket**: Socket.IO 4.6+
- **Validation**: Zod 3.22+
- **Testing**: Jest 29+ + Supertest
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, express-rate-limit

### Shared
- **Language**: TypeScript 5.9+
- **Validation**: Zod 3.22+
- **Build**: TypeScript Compiler

### Web
- **Framework**: Next.js 16
- **React**: React 19
- **Styling**: TailwindCSS 4 with PostCSS
- **UI Components**: Radix UI primitives
- **State Management**: Zustand 5 + React Query 5
- **Forms**: React Hook Form 7 + Zod
- **HTTP Client**: Axios 1.13+
- **WebSocket**: Socket.IO Client 4.8+
- **Theme**: next-themes 0.4+
- **Language**: TypeScript 5+
- **Linting**: ESLint 9

### Mobile
- **Framework**: React Native 0.81 with Expo 54
- **React**: React 19
- **Navigation**: Expo Router 6
- **UI Components**: Tamagui 1.141 + React Native Paper 5
- **State Management**: Zustand 5 with MMKV 4 persistence
- **Forms**: React Hook Form 7 + Zod 4
- **HTTP Client**: Axios 1.13+
- **WebSocket**: Socket.IO Client 4.8+
- **Language**: TypeScript 5.9+

---

## 🚢 Deployment

### Docker Deployment (Recommended)

The project includes complete Docker support for easy deployment:

```bash
# Production deployment with Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Supported Platforms:**
- **AWS ECS** - Elastic Container Service
- **Google Cloud Run** - Serverless containers
- **DigitalOcean App Platform** - PaaS with Docker support
- **Azure Container Instances** - Managed containers
- **Any VPS** - With Docker installed

> **See [DOCKER.md](./docs/DOCKER.md)** for complete Docker deployment guide

---

### Backend Deployment

Deploy to:
- **Docker** - Containerized deployment (recommended)
- **Render** - Free tier available
- **Railway** - Easy deployment with CLI
- **Heroku** - Classic PaaS
- **VPS** - DigitalOcean, AWS EC2, etc.

### Web Deployment

Deploy to:
- **Vercel** - Optimized for Next.js (recommended)
- **Netlify** - Great for static sites
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

### Mobile Deployment

Build and deploy with:
- **EAS Build** - Expo Application Services
- **App Store** - iOS deployment
- **Google Play Store** - Android deployment

> For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow for automated backend deployment to Render.

**How it works:**
- Automatically deploys backend when changes to `backend/` or `shared/` folders are merged to `master` branch
- Skips deployment for changes to web, mobile, or documentation files
- Supports manual deployment trigger from GitHub Actions tab

**Setup:**
1. Create a Render web service for your backend
2. Get Deploy Hook URL from Render Dashboard → Your Service → Settings → Deploy Hook
3. Add GitHub secret:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Create new secret: `RENDER_DEPLOY_HOOK_URL`
   - Paste your Deploy Hook URL as the value
4. Push changes to `master` branch - deployment will trigger automatically!

**Manual Deployment:**
- Go to GitHub Actions tab → "Deploy Backend to Render" → "Run workflow"

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests with coverage
yarn test

# Run tests in watch mode
yarn test:watch

# Run E2E tests
yarn test:e2e
```

Test coverage includes:
- ✅ Authentication flow (register, login, verify, reset)
- ✅ TODO CRUD operations
- ✅ Validation and error handling
- ✅ User-scoped data access
- ✅ Token refresh and rotation

---

## 🤝 Contributing

Contributions are welcome! This is a learning-focused monorepo.

### Ways to Contribute

1. **Implement Placeholder Services** - Choose from 9 placeholder services
2. **Enhance UI/UX** - Improve web and mobile interfaces
3. **Add Tests** - Increase test coverage
4. **Improve Documentation** - Fix typos, add examples
5. **Add Features** - File uploads, notifications, search, etc.
6. **Fix Bugs** - Report and fix issues

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`yarn test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

> See [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) for detailed workflow and conventions.

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- Verify `MONGO_URI` in `.env`
- Check MongoDB is running (local) or IP whitelist (Atlas)
- Ensure network connectivity

#### Redis Connection Failed
- Verify `REDIS_DATABASE_URI` format: `rediss://` for TLS
- Check Upstash dashboard for correct credentials
- For local Redis: ensure it's running (`redis-cli ping`)

#### Mobile App Not Connecting to Backend
- Check API base URL in `mobile/src/api/config.ts`
- Use `10.0.2.2` for Android emulator
- Use your computer's local IP for physical devices
- Ensure backend is running and accessible

#### Email OTP Not Sending
- Verify email credentials in `.env`
- For Gmail: use App Password, not regular password
- Check spam folder
- Review backend logs for email errors

#### Shared Package Changes Not Reflecting
```bash
cd shared
yarn build
# Restart backend/web/mobile dev servers
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with best practices from:
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Jest Testing Library](https://jestjs.io/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)

---

## 📞 Support

- **Documentation**: Check the [docs](./docs) directory
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Happy Coding! 🚀**
