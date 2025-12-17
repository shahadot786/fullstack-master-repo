# Development Guide

This guide covers the development workflow, best practices, and conventions for contributing to the Nexus fullstack monorepo.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style and Conventions](#code-style-and-conventions)
- [Testing Strategy](#testing-strategy)
- [Git Workflow](#git-workflow)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)
- [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Yarn** 1.22+ (recommended) or npm
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Redis** - [Upstash Redis](https://upstash.com/redis) or local installation
- **Git** - Version control
- **VS Code** (recommended) - With extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-master-repo

# Run automated setup
chmod +x setup.sh
./setup.sh

# Or manual setup
yarn install:all
cd shared && yarn build && cd ..
```

### Environment Setup

#### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `REDIS_DATABASE_URI` - Redis connection string (Upstash)
- `EMAIL_USER` - Email for sending OTPs
- `EMAIL_PASSWORD` - Email app password

#### Web

```bash
cd web
cp .env.example .env.local
# Edit .env.local
```

Required:
- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:8000)

#### Mobile

Update `mobile/src/api/config.ts`:
```typescript
// iOS simulator
export const API_BASE_URL = 'http://localhost:8000';

// Android emulator
export const API_BASE_URL = 'http://10.0.2.2:8000';

// Physical device (use your computer's IP)
export const API_BASE_URL = 'http://192.168.x.x:8000';
```

---

## Development Workflow

### Running All Applications

#### Option 1: Concurrent (Backend + Web)

```bash
# From root directory
yarn dev

# This runs:
# - shared (watch mode)
# - backend (development server)
# - web (Next.js dev server)
```

#### Option 2: Individual Terminals

```bash
# Terminal 1: Shared (watch mode)
cd shared && yarn dev

# Terminal 2: Backend
cd backend && yarn dev

# Terminal 3: Web
cd web && yarn dev

# Terminal 4: Mobile
cd mobile && yarn start
```

### Making Changes

#### 1. Changes to Shared Package

```bash
cd shared

# Make your changes to src/

# Build (or run in watch mode)
yarn build  # One-time build
yarn dev    # Watch mode

# Restart dependent apps (backend, web, mobile)
```

**Important**: Always rebuild shared package after changes!

#### 2. Changes to Backend

```bash
cd backend

# Make your changes to src/

# Development server auto-reloads
yarn dev

# Run tests
yarn test

# Run E2E tests
yarn test:e2e
```

#### 3. Changes to Web

```bash
cd web

# Make your changes to app/ or components/

# Next.js auto-reloads
yarn dev

# Build for production (to test)
yarn build
yarn start
```

#### 4. Changes to Mobile

```bash
cd mobile

# Make your changes to app/ or src/

# Expo auto-reloads
yarn start

# Clear cache if needed
yarn start --clear
```

### Hot Reload

- **Backend**: `ts-node-dev` auto-reloads on file changes
- **Web**: Next.js Fast Refresh
- **Mobile**: Expo Fast Refresh
- **Shared**: Use `yarn dev` for watch mode

---

## Code Style and Conventions

### TypeScript

```typescript
// Use explicit types for function parameters and return values
function createUser(data: CreateUserDTO): Promise<User> {
  // ...
}

// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string;
}

// Use type for unions and intersections
type UserRole = 'admin' | 'user';
type UserWithRole = User & { role: UserRole };

// Avoid 'any' - use 'unknown' if type is truly unknown
function processData(data: unknown) {
  if (typeof data === 'string') {
    // Type narrowing
  }
}
```

### Naming Conventions

```typescript
// Variables and functions: camelCase
const userId = '123';
function getUserById(id: string) { }

// Classes and interfaces: PascalCase
class AuthService { }
interface IUser { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'http://localhost:8000';

// Files: Match content
// - Components: PascalCase (TodoList.tsx)
// - Utilities: camelCase (formatDate.ts)
// - Services: camelCase.service.ts (auth.service.ts)
```

### Import Order

```typescript
// 1. External dependencies
import { Router } from 'express';
import { z } from 'zod';

// 2. Internal absolute imports (path aliases)
import { authenticate } from '@middleware/auth.middleware';
import { User } from '@fullstack-master/shared';

// 3. Relative imports
import * as controller from './auth.controller';
import { registerValidation } from './auth.validation';
```

### Component Structure (React)

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => void;
}

// 3. Component
export function TodoList({ todos, onDelete }: TodoListProps) {
  // 3a. Hooks
  const [filter, setFilter] = useState<string>('all');
  
  // 3b. Handlers
  const handleDelete = (id: string) => {
    onDelete(id);
  };
  
  // 3c. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Error Handling

```typescript
// Backend: Use custom error classes
import { NotFoundError, BadRequestError } from '@common/errors';

if (!user) {
  throw new NotFoundError('User not found');
}

if (!isValid) {
  throw new BadRequestError('Invalid input');
}

// Frontend: Try-catch with user-friendly messages
try {
  await api.createTodo(data);
  toast.success('Todo created successfully');
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || 'Failed to create todo');
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

---

## Testing Strategy

### Backend Testing

#### Unit Tests

```typescript
// __tests__/unit/auth.service.test.ts
import * as authService from '@services/auth/auth.service';

describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test1234',
        name: 'Test User',
      };
      
      const user = await authService.register(userData);
      
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });
  });
});
```

#### E2E Tests

```typescript
// __tests__/e2e/auth.e2e.test.ts
import request from 'supertest';
import app from '../../app';

describe('Auth E2E', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test1234',
        name: 'Test User',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('test@example.com');
  });
});
```

#### Running Tests

```bash
cd backend

# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run E2E tests
yarn test:e2e

# Run with coverage
yarn test --coverage
```

### Frontend Testing (Future)

```typescript
// web/components/__tests__/TodoList.test.tsx
import { render, screen } from '@testing-library/react';
import { TodoList } from '../TodoList';

describe('TodoList', () => {
  it('should render todos', () => {
    const todos = [
      { id: '1', title: 'Test Todo', completed: false },
    ];
    
    render(<TodoList todos={todos} onDelete={jest.fn()} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });
});
```

---

## Git Workflow

### Branch Naming

```bash
# Features
feature/add-chat-service
feature/implement-notifications

# Bug fixes
fix/login-validation-error
fix/todo-delete-bug

# Documentation
docs/update-readme
docs/add-api-examples

# Refactoring
refactor/auth-service
refactor/simplify-validation

# Chores
chore/update-dependencies
chore/cleanup-unused-code
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(auth): add email verification with OTP
fix(todos): resolve delete confirmation dialog bug
docs(readme): update installation instructions
refactor(api): simplify error handling middleware
chore(deps): update dependencies to latest versions
test(auth): add E2E tests for registration flow
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat(service): add new feature"
   ```

3. **Push to Remote**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create Pull Request**
   - Describe changes
   - Link related issues
   - Add screenshots (for UI changes)
   - Request review

5. **Address Review Comments**
   ```bash
   git add .
   git commit -m "fix: address review comments"
   git push origin feature/my-feature
   ```

6. **Merge**
   - Squash and merge (preferred)
   - Delete branch after merge

---

## Debugging

### Backend Debugging

#### VS Code Launch Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Console Logging

```typescript
// Use descriptive logs
console.log('[AuthService] Registering user:', email);
console.error('[AuthService] Registration failed:', error);

// Remove before committing (or use debug library)
```

### Web Debugging

#### React DevTools

Install [React Developer Tools](https://react.dev/learn/react-developer-tools)

#### Network Tab

- Check API requests/responses
- Verify request headers (Authorization)
- Check response status codes

#### Console Errors

```typescript
// Add error boundaries
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Mobile Debugging

#### React Native Debugger

```bash
# Open debugger
# Press 'j' in Expo CLI

# Or use Flipper
yarn global add flipper
flipper
```

#### Console Logs

```typescript
// Logs appear in terminal
console.log('[TodoScreen] Fetching todos');

// Use Reactotron for better debugging
```

---

## Performance Optimization

### Backend

```typescript
// 1. Database Indexing
const UserSchema = new Schema({
  email: { type: String, index: true, unique: true },
});

// 2. Query Optimization
// ❌ Bad: N+1 query
const todos = await Todo.find({ userId });
for (const todo of todos) {
  const user = await User.findById(todo.userId); // N queries
}

// ✅ Good: Single query with populate
const todos = await Todo.find({ userId }).populate('userId');

// 3. Caching with Redis
const cachedUser = await redis.get(`user:${userId}`);
if (cachedUser) {
  return JSON.parse(cachedUser);
}
const user = await User.findById(userId);
await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
```

### Web

```typescript
// 1. React Query Caching
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: getTodos,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// 2. Code Splitting
const TodoList = dynamic(() => import('@/components/TodoList'), {
  loading: () => <LoadingSpinner />,
});

// 3. Image Optimization
import Image from 'next/image';
<Image src="/logo.png" width={200} height={200} alt="Logo" />
```

### Mobile

```typescript
// 1. FlatList for Long Lists
<FlatList
  data={todos}
  renderItem={({ item }) => <TodoItem todo={item} />}
  keyExtractor={(item) => item.id}
  windowSize={10}
/>

// 2. Memoization
const MemoizedTodoItem = React.memo(TodoItem);

// 3. Avoid Inline Functions
// ❌ Bad
<Button onPress={() => handleDelete(id)} />

// ✅ Good
const handlePress = useCallback(() => handleDelete(id), [id]);
<Button onPress={handlePress} />
```

---

## Common Tasks

### Adding a New Backend Service

See [CREATING_NEW_SERVICE.md](./CREATING_NEW_SERVICE.md)

### Adding a New Web Page

```bash
# 1. Create page file
mkdir -p web/app/(dashboard)/my-feature
touch web/app/(dashboard)/my-feature/page.tsx

# 2. Create components
mkdir -p web/components/my-feature
touch web/components/my-feature/MyFeatureList.tsx

# 3. Create API client
touch web/lib/api/my-feature.ts

# 4. Create React Query hooks
touch web/lib/hooks/useMyFeature.ts

# 5. Update sidebar navigation
# Edit web/components/layout/Sidebar.tsx
```

### Adding a New Mobile Screen

```bash
# 1. Create screen file
touch mobile/app/(tabs)/my-feature.tsx

# 2. Create components
mkdir -p mobile/src/components/my-feature
touch mobile/src/components/my-feature/MyFeatureList.tsx

# 3. Create API client
touch mobile/src/api/my-feature.ts

# 4. Create hooks
touch mobile/src/hooks/useMyFeature.ts

# 5. Update tab navigation
# Edit mobile/app/(tabs)/_layout.tsx
```

### Updating Dependencies

```bash
# Check for outdated packages
yarn outdated

# Update specific package
yarn upgrade package-name

# Update all packages (careful!)
yarn upgrade --latest

# Update shared package in backend/web/mobile
cd backend && yarn upgrade @fullstack-master/shared
cd web && yarn upgrade @fullstack-master/shared
```

### Database Migrations

```typescript
// Create migration script
// backend/scripts/migrate-add-field.ts
import mongoose from 'mongoose';
import User from '../src/services/auth/auth.model';

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI!);
  
  await User.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: 'default' } }
  );
  
  console.log('Migration complete');
  process.exit(0);
}

migrate();
```

---

## Best Practices

### General

1. **Write Tests** - Aim for 80%+ coverage
2. **Use TypeScript** - Avoid `any`, use proper types
3. **Handle Errors** - Always handle errors gracefully
4. **Document Code** - Add JSDoc comments for complex logic
5. **Keep It Simple** - Avoid over-engineering
6. **Review Code** - Always review your own code before PR

### Backend

1. **Validate Input** - Use Zod schemas for all inputs
2. **Scope by User** - Always filter by `userId` for user data
3. **Use Transactions** - For multi-document operations
4. **Log Errors** - Use proper logging (not just console.log)
5. **Rate Limit** - Protect endpoints from abuse

### Frontend

1. **Use React Query** - For server state management
2. **Optimize Re-renders** - Use `memo`, `useMemo`, `useCallback`
3. **Handle Loading States** - Show spinners/skeletons
4. **Handle Errors** - Show user-friendly error messages
5. **Accessibility** - Use semantic HTML, ARIA labels

---

## Troubleshooting

### Shared Package Changes Not Reflecting

```bash
cd shared
yarn build
# Restart backend/web/mobile
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
mongosh

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/nexus
```

### Redis Connection Issues

```bash
# Check Redis is running (local)
redis-cli ping

# Check Upstash credentials (cloud)
# Verify REDIS_DATABASE_URI in .env
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
yarn build
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/)
- [React Query Documentation](https://tanstack.com/query/latest)

---

**Happy Coding! 🚀**
