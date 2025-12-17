# Project Structure Guide

This document provides a detailed explanation of the project structure, file organization, and naming conventions used throughout the Nexus monorepo.

---

## Table of Contents

- [Monorepo Overview](#monorepo-overview)
- [Backend Structure](#backend-structure)
- [Web Application Structure](#web-application-structure)
- [Mobile Application Structure](#mobile-application-structure)
- [Shared Package Structure](#shared-package-structure)
- [Configuration Files](#configuration-files)
- [Naming Conventions](#naming-conventions)

---

## Monorepo Overview

```
fullstack-master-repo/
├── backend/                    # Node.js/Express API
├── web/                        # Next.js web application
├── mobile/                     # React Native/Expo mobile app
├── shared/                     # Shared types and validation
├── docs/                       # Documentation
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT license
├── README.md                   # Main documentation
├── package.json                # Root package.json (workspace scripts)
└── setup.sh                    # Automated setup script
```

### Package Independence

Each package maintains its own `node_modules` directory:
- **Why**: React Native/Expo requires specific dependency versions
- **Benefit**: No version conflicts between packages
- **Trade-off**: Larger disk usage, but better stability

---

## Backend Structure

```
backend/
├── src/
│   ├── common/                 # Shared utilities and services
│   │   ├── db/
│   │   │   └── mongoose.ts     # MongoDB connection
│   │   ├── errors/
│   │   │   ├── AppError.ts     # Base error class
│   │   │   ├── BadRequestError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   ├── UnauthorizedError.ts
│   │   │   └── index.ts        # Error exports
│   │   ├── services/
│   │   │   ├── email.service.ts    # Nodemailer email service
│   │   │   ├── redis.service.ts    # Redis client & utilities
│   │   │   └── websocket.service.ts # Socket.IO setup
│   │   └── utils/
│   │       ├── async-handler.util.ts  # Async error wrapper
│   │       └── response.util.ts       # Standardized responses
│   │
│   ├── config/
│   │   ├── index.ts            # Environment variables
│   │   ├── module-alias.ts     # Path alias registration (production)
│   │   └── swagger.ts          # Swagger/OpenAPI configuration
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT authentication
│   │   ├── error.middleware.ts     # Global error handler
│   │   └── validation.middleware.ts # Zod validation
│   │
│   └── services/               # Business logic by feature
│       ├── index.ts            # Service exports
│       │
│       ├── auth/               # ✅ Authentication service (IMPLEMENTED)
│       │   ├── auth.controller.ts  # Request handlers
│       │   ├── auth.model.ts       # User Mongoose model
│       │   ├── auth.routes.ts      # Express routes
│       │   ├── auth.service.ts     # Business logic
│       │   └── auth.validation.ts  # Zod schemas
│       │
│       ├── todo/               # ✅ TODO service (IMPLEMENTED)
│       │   ├── todo.controller.ts
│       │   ├── todo.model.ts
│       │   ├── todo.routes.ts
│       │   ├── todo.service.ts
│       │   └── todo.validation.ts
│       │
│       └── [service]/          # 🚧 Placeholder services
│           └── index.ts        # Empty placeholder
│
├── __tests__/                  # Test files
│   ├── setup.ts                # Jest setup
│   └── e2e/
│       ├── auth.e2e.test.ts    # Auth E2E tests
│       └── todo.e2e.test.ts    # Todo E2E tests
│
├── app.ts                      # Express app configuration
├── server.ts                   # Server entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest configuration
├── jest.e2e.config.js          # E2E test configuration
└── README.md                   # Backend documentation
```

### Service Structure Pattern

Each fully implemented service follows this pattern:

```
services/[service-name]/
├── [service].model.ts          # Data model
├── [service].service.ts        # Business logic
├── [service].controller.ts     # HTTP handlers
├── [service].routes.ts         # Route definitions
└── [service].validation.ts     # Input validation
```

**Example: Auth Service**

```typescript
// auth.model.ts - Mongoose schema
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  // ...
}
const UserSchema = new Schema<IUser>({ /* ... */ });
export default mongoose.model<IUser>('User', UserSchema);

// auth.service.ts - Business logic
export const register = async (data: RegisterDTO) => {
  // Hash password, create user, generate OTP, send email
};

// auth.controller.ts - Request handlers
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 'Registration successful', 201);
});

// auth.routes.ts - Route definitions
router.post('/register', validate(registerValidation), controller.register);

// auth.validation.ts - Zod schemas
export const registerValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
  }),
});
```

### Path Aliases

The backend uses TypeScript path aliases for clean imports:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@common/*": ["./src/common/*"],
      "@config/*": ["./src/config/*"],
      "@middleware/*": ["./src/middleware/*"],
      "@services/*": ["./src/services/*"]
    }
  }
}

// Usage in code
import { connectDB } from '@common/db/mongoose';
import { authenticate } from '@middleware/auth.middleware';
import * as authService from '@services/auth/auth.service';
```

---

## Web Application Structure

```
web/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group (no dashboard layout)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── register/
│   │   │   └── page.tsx        # Registration page
│   │   ├── verify/
│   │   │   └── page.tsx        # Email verification page
│   │   └── reset-password/
│   │       └── page.tsx        # Password reset page
│   │
│   ├── (dashboard)/            # Dashboard route group (with sidebar layout)
│   │   ├── layout.tsx          # Dashboard layout (sidebar, header)
│   │   │
│   │   ├── todos/              # ✅ TODO management (IMPLEMENTED)
│   │   │   └── page.tsx
│   │   │
│   │   ├── profile/            # ✅ User profile (IMPLEMENTED)
│   │   │   └── page.tsx
│   │   │
│   │   ├── aiqa/               # 🚧 Placeholder pages
│   │   ├── chat/
│   │   ├── delivery/
│   │   ├── expense/
│   │   ├── notes/
│   │   ├── shop/
│   │   ├── social/
│   │   ├── urlshort/
│   │   └── weather/
│   │       └── page.tsx
│   │
│   ├── layout.tsx              # Root layout (providers, fonts)
│   ├── page.tsx                # Home page (redirects to dashboard)
│   ├── providers.tsx           # React Query & theme providers
│   ├── globals.css             # Global styles
│   └── favicon.ico             # Favicon
│
├── components/                 # Reusable components
│   ├── ui/                     # Radix UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ...
│   ├── todos/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── AddTodoDialog.tsx
│   │   └── ...
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── ThemeToggle.tsx
│
├── lib/                        # Utilities and API client
│   ├── api/
│   │   ├── client.ts           # Axios instance
│   │   ├── auth.ts             # Auth API calls
│   │   ├── todos.ts            # Todo API calls
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts          # Auth hook
│   │   ├── useTodos.ts         # Todos hook with React Query
│   │   └── ...
│   ├── store/
│   │   ├── authStore.ts        # Zustand auth store
│   │   └── ...
│   └── utils.ts                # Utility functions
│
├── public/                     # Static assets
│   ├── images/
│   └── ...
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
└── README.md
```

### Route Groups

Next.js route groups `(name)` organize routes without affecting URLs:

```
app/
├── (auth)/login/page.tsx       → /login
├── (auth)/register/page.tsx    → /register
└── (dashboard)/todos/page.tsx  → /todos
```

**Benefits**:
- Different layouts for auth vs dashboard
- Organized file structure
- No impact on URL structure

### Component Organization

```
components/
├── ui/                 # Generic UI components (Radix UI)
├── [feature]/          # Feature-specific components
└── layout/             # Layout components (Sidebar, Header)
```

**Naming Convention**:
- PascalCase for component files: `TodoList.tsx`
- Descriptive names: `AddTodoDialog.tsx` not `Dialog.tsx`

---

## Mobile Application Structure

```
mobile/
├── app/                        # Expo Router (file-based routing)
│   ├── (auth)/                 # Auth stack
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── verify.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   │
│   ├── (tabs)/                 # Tab navigator (authenticated)
│   │   ├── _layout.tsx         # Tab layout
│   │   ├── index.tsx           # Home tab (todos)
│   │   ├── profile.tsx         # Profile tab
│   │   └── more.tsx            # More tab
│   │
│   ├── _layout.tsx             # Root layout
│   └── +not-found.tsx          # 404 page
│
├── src/
│   ├── api/                    # API client
│   │   ├── client.ts           # Axios instance
│   │   ├── auth.ts             # Auth API
│   │   ├── todos.ts            # Todos API
│   │   └── config.ts           # API configuration
│   │
│   ├── components/             # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ScreenLayout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── todos/
│   │       ├── TodoList.tsx
│   │       ├── TodoItem.tsx
│   │       └── AddTodoModal.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useTodos.ts
│   │   ├── useTheme.ts
│   │   └── useSocket.ts
│   │
│   ├── services/               # Business logic
│   │   └── socket.service.ts   # WebSocket service
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts        # Auth state + MMKV persistence
│   │   ├── todoStore.ts        # Todo state
│   │   └── themeStore.ts       # Theme state
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts            # Type definitions
│   │
│   ├── utils/                  # Utility functions
│   │   ├── storage.ts          # MMKV storage utilities
│   │   └── validation.ts       # Validation helpers
│   │
│   └── config/                 # Configuration
│       └── theme.ts            # Tamagui theme config
│
├── assets/                     # Images, fonts, etc.
│   ├── images/
│   └── fonts/
│
├── package.json
├── tsconfig.json
├── app.json                    # Expo configuration
├── babel.config.js
├── metro.config.js
└── README.md
```

### Expo Router File-Based Routing

```
app/
├── (auth)/login.tsx            → /login (auth stack)
├── (tabs)/index.tsx            → / (home tab)
├── (tabs)/profile.tsx          → /profile (profile tab)
└── modal.tsx                   → /modal (modal route)
```

**Special Files**:
- `_layout.tsx` - Layout for the directory
- `+not-found.tsx` - 404 page
- `[id].tsx` - Dynamic route

### State Management with MMKV

```typescript
// Fast, synchronous storage
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Zustand persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => storage.getString(name) ?? null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.delete(name),
      },
    }
  )
);
```

---

## Shared Package Structure

```
shared/
├── src/
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   │       ├── User
│   │       ├── Todo
│   │       ├── AuthResponse
│   │       └── ...
│   │
│   ├── validation/
│   │   └── index.ts            # Zod schemas
│   │       ├── registerSchema
│   │       ├── loginSchema
│   │       ├── todoSchema
│   │       └── ...
│   │
│   ├── constants/
│   │   └── index.ts            # Shared constants
│   │       ├── HTTP_STATUS
│   │       ├── ERROR_MESSAGES
│   │       ├── API_ENDPOINTS
│   │       └── ...
│   │
│   ├── utils/
│   │   └── index.ts            # Helper functions
│   │       ├── formatDate
│   │       ├── validateEmail
│   │       └── ...
│   │
│   └── index.ts                # Main export file
│
├── dist/                       # Compiled JavaScript (gitignored)
│   ├── index.js
│   ├── index.d.ts
│   └── ...
│
├── package.json
├── tsconfig.json
└── README.md
```

### Export Strategy

```typescript
// src/index.ts - Single entry point
export * from './types';
export * from './validation';
export * from './constants';
export * from './utils';

// Usage in other packages
import { User, Todo, registerSchema, HTTP_STATUS } from '@fullstack-master/shared';
```

### Build Process

```bash
# Development (watch mode)
yarn dev

# Production build
yarn build

# Output: dist/index.js, dist/index.d.ts
```

---

## Configuration Files

### Root Level

```
fullstack-master-repo/
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT license
├── README.md                   # Main documentation
├── package.json                # Workspace scripts
└── setup.sh                    # Automated setup script
```

### Backend Configuration

```
backend/
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── tsconfig.json               # TypeScript config
├── jest.config.js              # Jest config
├── jest.e2e.config.js          # E2E test config
└── package.json                # Dependencies and scripts
```

### Web Configuration

```
web/
├── .env.local                  # Local environment (gitignored)
├── .env.example                # Environment template
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── postcss.config.mjs          # PostCSS config
├── next.config.ts              # Next.js config
├── eslint.config.mjs           # ESLint config
└── package.json                # Dependencies and scripts
```

### Mobile Configuration

```
mobile/
├── .env                        # Environment variables (gitignored)
├── tsconfig.json               # TypeScript config
├── app.json                    # Expo config
├── babel.config.js             # Babel config
├── metro.config.js             # Metro bundler config
├── eas.json                    # EAS Build config
└── package.json                # Dependencies and scripts
```

---

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `TodoList.tsx`, `LoginForm.tsx` |
| **Utilities** | camelCase | `formatDate.ts`, `apiClient.ts` |
| **Types** | PascalCase | `User.ts`, `TodoItem.ts` |
| **Constants** | UPPER_SNAKE_CASE | `HTTP_STATUS`, `API_ENDPOINTS` |
| **Hooks** | camelCase with `use` prefix | `useAuth.ts`, `useTodos.ts` |
| **Services** | camelCase with `.service` suffix | `auth.service.ts`, `email.service.ts` |
| **Models** | camelCase with `.model` suffix | `user.model.ts`, `todo.model.ts` |
| **Routes** | camelCase with `.routes` suffix | `auth.routes.ts`, `todo.routes.ts` |
| **Tests** | Same as file with `.test` suffix | `auth.service.test.ts`, `todo.e2e.test.ts` |

### Code Conventions

```typescript
// Interfaces: PascalCase with 'I' prefix
interface IUser {
  id: string;
  email: string;
}

// Types: PascalCase
type AuthResponse = {
  user: IUser;
  token: string;
};

// Enums: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
}

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const API_BASE_URL = 'http://localhost:8000';

// Functions: camelCase
function formatDate(date: Date): string {
  // ...
}

// Classes: PascalCase
class AuthService {
  // ...
}

// Variables: camelCase
const userId = '123';
const isAuthenticated = true;
```

### Git Conventions

```bash
# Branch naming
feature/add-chat-service
fix/login-validation-error
docs/update-readme
refactor/auth-service

# Commit messages
feat: add chat service with WebSocket support
fix: resolve login validation error
docs: update README with new features
refactor: simplify auth service logic
```

---

## Best Practices

### File Organization

1. **Group by Feature** - Not by type
   ```
   ✅ Good: services/auth/auth.controller.ts
   ❌ Bad: controllers/auth.controller.ts
   ```

2. **Consistent Structure** - Same pattern for all services
   ```
   services/[service]/
   ├── [service].model.ts
   ├── [service].service.ts
   ├── [service].controller.ts
   ├── [service].routes.ts
   └── [service].validation.ts
   ```

3. **Clear Naming** - Descriptive, not generic
   ```
   ✅ Good: AddTodoDialog.tsx
   ❌ Bad: Dialog.tsx
   ```

4. **Single Responsibility** - One file, one purpose
   ```
   ✅ Good: auth.service.ts (auth logic only)
   ❌ Bad: utils.ts (everything)
   ```

### Import Organization

```typescript
// 1. External dependencies
import { Router } from 'express';
import { z } from 'zod';

// 2. Internal absolute imports (path aliases)
import { authenticate } from '@middleware/auth.middleware';
import { validate } from '@middleware/validation.middleware';

// 3. Relative imports
import * as controller from './auth.controller';
import { registerValidation } from './auth.validation';
```

---

## Conclusion

This structure provides:
- ✅ **Scalability** - Easy to add new features
- ✅ **Maintainability** - Clear organization
- ✅ **Consistency** - Same patterns throughout
- ✅ **Type Safety** - Shared types across all apps
- ✅ **Developer Experience** - Easy to navigate

For more information:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Development workflow
- [CREATING_NEW_SERVICE.md](./CREATING_NEW_SERVICE.md) - Service creation guide
