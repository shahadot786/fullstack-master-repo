# Fullstack Master Boilerplate

A production-ready, type-safe fullstack boilerplate with **Backend (Node.js/Express/MongoDB)**, **Web (Next.js)**, and **Mobile (React Native)** applications. Built with TypeScript, featuring JWT authentication, API documentation, testing, and CI/CD.

## 🚀 Features

### Backend
- ✅ **TypeScript** - Full type safety
- ✅ **Authentication** - JWT with bcrypt
- ✅ **Validation** - Zod schemas
- ✅ **API Docs** - Swagger/OpenAPI at `/api-docs`
- ✅ **Testing** - Jest + Supertest E2E tests
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Path Aliases** - Clean imports with `@` prefixes

### Shared Module
- ✅ **Types** - Shared TypeScript interfaces
- ✅ **Validation** - Reusable Zod schemas
- ✅ **Constants** - API endpoints, error messages
- ✅ **Utils** - Common helper functions

### Web (Coming Soon)
- Next.js 14+ with App Router
- TailwindCSS styling
- Zustand state management
- React Hook Form + Zod validation

### Mobile (Coming Soon)
- React Native with TypeScript
- Bottom tab navigation
- AsyncStorage for persistence
- Shared API client

## 📁 Project Structure

```
fullstack-master-repo/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── common/   # Shared utilities
│   │   ├── config/   # Configuration
│   │   ├── middleware/
│   │   └── services/ # Business logic
│   ├── __tests__/    # Test files
│   └── package.json
├── shared/           # Shared types & validation
│   ├── src/
│   │   ├── types/
│   │   ├── validation/
│   │   ├── constants/
│   │   └── utils/
│   └── package.json
├── web/              # Next.js application
├── mobile/           # React Native app
└── docs/             # Documentation
```

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret

# Run development server
npm run dev

# API will be available at http://localhost:8000
# Swagger docs at http://localhost:8000/api-docs
```

### Shared Module Setup

```bash
cd shared
npm install
npm run build
```

### Run Tests

```bash
cd backend
npm test              # Unit tests
npm run test:e2e      # E2E tests
```

## 📚 Documentation

- [Backend Setup](./backend/README.md)
- [Creating New Service](./docs/CREATING_NEW_SERVICE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](http://localhost:8000/api-docs) (when running)

## 🔐 Authentication

The boilerplate includes a complete JWT-based authentication system:

- User registration with password hashing (bcrypt)
- Login with JWT token generation
- Protected routes with authentication middleware
- Token-based authorization

### Example Usage

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234"}'

# Access protected route
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
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS

### Shared
- **Language**: TypeScript
- **Validation**: Zod
- **Build**: TypeScript Compiler

### Web (Planned)
- **Framework**: Next.js 14+
- **Styling**: TailwindCSS
- **State**: Zustand
- **Forms**: React Hook Form
- **HTTP**: Axios

### Mobile (Planned)
- **Framework**: React Native
- **Navigation**: React Navigation
- **State**: Zustand
- **HTTP**: Axios

## 📖 Learning Resources

This boilerplate is designed as a learning project. Key concepts covered:

1. **Multi-service Architecture** - Organize code by business domains
2. **Type Safety** - End-to-end TypeScript with shared types
3. **Authentication** - JWT-based auth with proper security
4. **Validation** - Schema validation with Zod
5. **Testing** - Unit and E2E testing strategies
6. **API Documentation** - Swagger/OpenAPI best practices
7. **Error Handling** - Centralized error management
8. **Path Aliases** - Clean import statements
9. **CI/CD** - Automated testing and deployment

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new services following the TODO example
- Improve documentation
- Add more tests
- Suggest best practices

## 📄 License

MIT

## 🙏 Acknowledgments

Built with best practices from:
- Express.js documentation
- MongoDB best practices
- TypeScript handbook
- Jest testing library
- Swagger/OpenAPI specification
