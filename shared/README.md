# Shared Module

Common types, validation schemas, constants, and utilities shared across backend, web, and mobile applications.

## Installation

```bash
npm install
npm run build
```

## Usage

### In Backend

```typescript
import { User, createTodoSchema, ERROR_MESSAGES } from "@fullstack-master/shared";
```

### In Web/Mobile

```typescript
import { Todo, loginSchema, API_ENDPOINTS } from "@fullstack-master/shared";
```

## Structure

- **types/**: TypeScript interfaces and types
- **validation/**: Zod validation schemas
- **constants/**: API endpoints, error messages, HTTP status codes
- **utils/**: Common utility functions

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run clean` - Remove dist directory
