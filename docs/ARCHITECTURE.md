# System Architecture

This document describes the architecture of the Nexus fullstack monorepo, including system design, component interactions, and architectural patterns.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Backend Architecture](#backend-architecture)
- [Web Application Architecture](#web-application-architecture)
- [Mobile Application Architecture](#mobile-application-architecture)
- [Shared Package Architecture](#shared-package-architecture)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)

---

## High-Level Architecture

The Nexus monorepo follows a **multi-platform, service-oriented architecture** with shared type safety across all applications.

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web App<br/>Next.js 16]
        MOBILE[Mobile App<br/>React Native/Expo]
    end

    subgraph "API Layer"
        API[Express API<br/>Node.js/TypeScript]
        WS[WebSocket Server<br/>Socket.IO]
    end

    subgraph "Data Layer"
        MONGO[(MongoDB<br/>Primary Database)]
        REDIS[(Redis<br/>Cache & Sessions)]
    end

    subgraph "External Services"
        EMAIL[Email Service<br/>Nodemailer]
    end

    subgraph "Shared"
        SHARED[Shared Package<br/>Types & Validation]
    end

    WEB --> API
    WEB --> WS
    MOBILE --> API
    MOBILE --> WS
    
    API --> MONGO
    API --> REDIS
    API --> EMAIL
    WS --> REDIS
    
    SHARED -.->|Types| WEB
    SHARED -.->|Types| MOBILE
    SHARED -.->|Types| API
```

### Key Architectural Principles

1. **Type Safety** - End-to-end TypeScript with shared types
2. **Separation of Concerns** - Clear boundaries between layers
3. **Service-Oriented** - Modular backend services
4. **Stateless API** - JWT-based authentication, no server sessions
5. **Real-time Capable** - WebSocket support for live updates
6. **Scalable** - Horizontal scaling ready with Redis
7. **Testable** - Dependency injection and mocking support

---

## Backend Architecture

The backend follows a **layered service architecture** with clear separation of concerns.

### Architecture Layers

```mermaid
graph TD
    subgraph "Presentation Layer"
        ROUTES[Routes<br/>Express Router]
        MIDDLEWARE[Middleware<br/>Auth, Validation, Error]
    end

    subgraph "Business Logic Layer"
        CONTROLLERS[Controllers<br/>Request Handling]
        SERVICES[Services<br/>Business Logic]
    end

    subgraph "Data Access Layer"
        MODELS[Mongoose Models<br/>Schema Definitions]
        DB[(MongoDB)]
    end

    subgraph "Infrastructure Layer"
        REDIS_SVC[Redis Service]
        EMAIL_SVC[Email Service]
        WS_SVC[WebSocket Service]
    end

    ROUTES --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> MODELS
    SERVICES --> REDIS_SVC
    SERVICES --> EMAIL_SVC
    SERVICES --> WS_SVC
    MODELS --> DB
```

### Directory Structure Pattern

Each service follows a consistent structure:

```
services/
└── [service-name]/
    ├── [service].model.ts       # Mongoose schema & model
    ├── [service].service.ts     # Business logic
    ├── [service].controller.ts  # Request handlers
    ├── [service].routes.ts      # Route definitions
    └── [service].validation.ts  # Zod validation schemas
```

### Service Architecture Pattern

```typescript
// Flow: Route → Middleware → Controller → Service → Model → Database

// 1. Route Definition
router.post('/', authenticate, validate(schema), controller.create);

// 2. Middleware Chain
// - authenticate: Verify JWT token
// - validate: Validate request with Zod schema

// 3. Controller (Presentation Layer)
export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const item = await service.create(userId, req.body);
  sendSuccess(res, item, 'Created successfully', HTTP_STATUS.CREATED);
});

// 4. Service (Business Logic Layer)
export const create = async (userId: string, data: CreateDTO) => {
  // Business logic, validation, transformations
  return Model.create({ ...data, userId });
};

// 5. Model (Data Access Layer)
const schema = new Schema({ /* ... */ });
export default mongoose.model('Item', schema);
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Route
    participant AuthMiddleware
    participant Controller
    participant AuthService
    participant MongoDB
    participant Redis
    participant Email

    Client->>Route: POST /api/auth/register
    Route->>AuthMiddleware: validate(registerSchema)
    AuthMiddleware->>Controller: Valid request
    Controller->>AuthService: register(data)
    AuthService->>MongoDB: Create user
    AuthService->>AuthService: Hash password (bcrypt)
    AuthService->>AuthService: Generate OTP
    AuthService->>Redis: Store OTP (10min TTL)
    AuthService->>Email: Send OTP email
    AuthService->>AuthService: Generate JWT tokens
    AuthService->>Redis: Store refresh token
    AuthService-->>Controller: { user, accessToken, refreshToken }
    Controller-->>Client: 201 Created
```

### WebSocket Architecture

```mermaid
graph LR
    subgraph "Client"
        WEB_CLIENT[Web Client]
        MOBILE_CLIENT[Mobile Client]
    end

    subgraph "WebSocket Server"
        WS_SERVER[Socket.IO Server]
        WS_AUTH[JWT Authentication]
        WS_ROOMS[User Rooms]
    end

    subgraph "Backend Services"
        AUTH_SVC[Auth Service]
        TODO_SVC[Todo Service]
    end

    WEB_CLIENT -->|Connect + JWT| WS_SERVER
    MOBILE_CLIENT -->|Connect + JWT| WS_SERVER
    WS_SERVER --> WS_AUTH
    WS_AUTH --> WS_ROOMS
    
    AUTH_SVC -.->|Emit Events| WS_ROOMS
    TODO_SVC -.->|Emit Events| WS_ROOMS
```

### Middleware Pipeline

```mermaid
graph LR
    REQ[Request] --> HELMET[Helmet<br/>Security Headers]
    HELMET --> CORS[CORS<br/>Origin Check]
    CORS --> RATE[Rate Limiter<br/>DDoS Protection]
    RATE --> MORGAN[Morgan<br/>Logging]
    MORGAN --> JSON[JSON Parser]
    JSON --> AUTH{Auth<br/>Required?}
    AUTH -->|Yes| JWT[JWT Verify]
    AUTH -->|No| VAL{Validation<br/>Required?}
    JWT --> VAL
    VAL -->|Yes| ZOD[Zod Validate]
    VAL -->|No| CTRL[Controller]
    ZOD --> CTRL
    CTRL --> RES[Response]
```

---

## Web Application Architecture

The web application uses **Next.js 16 App Router** with a modern React architecture.

### Application Structure

```mermaid
graph TD
    subgraph "App Router"
        ROOT[Root Layout<br/>Providers]
        AUTH_GROUP["(auth) Group<br/>Login, Register, Verify"]
        DASH_GROUP["(dashboard) Group<br/>Protected Pages"]
    end

    subgraph "State Management"
        ZUSTAND[Zustand Stores<br/>Client State]
        REACT_QUERY[React Query<br/>Server State]
    end

    subgraph "API Layer"
        API_CLIENT[Axios Client<br/>HTTP Requests]
        WS_CLIENT[Socket.IO Client<br/>WebSocket]
    end

    subgraph "UI Layer"
        COMPONENTS[Reusable Components<br/>Radix UI]
        FORMS[React Hook Form<br/>+ Zod Validation]
    end

    ROOT --> AUTH_GROUP
    ROOT --> DASH_GROUP
    
    DASH_GROUP --> ZUSTAND
    DASH_GROUP --> REACT_QUERY
    
    REACT_QUERY --> API_CLIENT
    DASH_GROUP --> WS_CLIENT
    
    DASH_GROUP --> COMPONENTS
    DASH_GROUP --> FORMS
```

### State Management Strategy

```typescript
// 1. Client State (Zustand) - UI state, user preferences
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);

// 2. Server State (React Query) - API data, caching
const { data: todos, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: () => todoApi.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// 3. Form State (React Hook Form) - Form inputs
const form = useForm<TodoFormData>({
  resolver: zodResolver(todoSchema),
  defaultValues: { title: '', description: '' },
});
```

### Route Organization

```
app/
├── layout.tsx                 # Root layout (providers, fonts)
├── (auth)/                    # Auth route group (no layout)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify/page.tsx
│   └── reset-password/page.tsx
└── (dashboard)/               # Dashboard route group (with sidebar)
    ├── layout.tsx             # Dashboard layout (sidebar, header)
    ├── todos/page.tsx
    ├── profile/page.tsx
    └── [feature]/page.tsx     # Other feature pages
```

### API Client Architecture

```typescript
// Centralized API client with interceptors
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const newToken = await refreshToken();
      if (newToken) {
        // Retry original request
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(error.config);
      }
      // Redirect to login
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Mobile Application Architecture

The mobile app uses **Expo Router** with file-based routing and native navigation.

### Navigation Architecture

```mermaid
graph TD
    ROOT[Root Layout<br/>_layout.tsx]
    
    ROOT --> AUTH_STACK[Auth Stack<br/>Not Authenticated]
    ROOT --> TABS[Tab Navigator<br/>Authenticated]
    
    AUTH_STACK --> LOGIN[Login Screen]
    AUTH_STACK --> REGISTER[Register Screen]
    AUTH_STACK --> VERIFY[Verify Screen]
    AUTH_STACK --> RESET[Reset Password]
    
    TABS --> HOME_TAB[Home Tab<br/>Todo List]
    TABS --> PROFILE_TAB[Profile Tab]
    TABS --> MORE_TAB[More Tab]
    
    HOME_TAB --> TODO_DETAIL[Todo Detail<br/>Modal]
    HOME_TAB --> ADD_TODO[Add Todo<br/>Modal]
```

### State Persistence

```typescript
// MMKV Storage for fast, synchronous persistence
const storage = new MMKV();

// Zustand store with MMKV persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
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

### Screen Structure Pattern

```typescript
// Consistent screen structure
export default function TodoListScreen() {
  // 1. Hooks
  const { data: todos, isLoading } = useTodos();
  const navigation = useNavigation();
  
  // 2. Handlers
  const handleAddTodo = () => {
    navigation.navigate('AddTodo');
  };
  
  // 3. Render
  return (
    <ScreenLayout title="Todos">
      {isLoading ? <LoadingSpinner /> : <TodoList todos={todos} />}
      <FAB onPress={handleAddTodo} />
    </ScreenLayout>
  );
}
```

---

## Shared Package Architecture

The shared package provides **type-safe contracts** between all applications.

### Package Structure

```
shared/
├── src/
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── validation/
│   │   └── index.ts          # Zod schemas
│   ├── constants/
│   │   └── index.ts          # Shared constants
│   ├── utils/
│   │   └── index.ts          # Helper functions
│   └── index.ts              # Main export
└── dist/                     # Compiled output
```

### Type Sharing Strategy

```typescript
// shared/src/types/index.ts
export interface User {
  _id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Used in backend
import { User, Todo } from '@fullstack-master/shared';

// Used in web
import { User, Todo } from '@fullstack-master/shared';

// Used in mobile
import { User, Todo } from '@fullstack-master/shared';
```

### Validation Schema Sharing

```typescript
// shared/src/validation/index.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
});

// Backend validation middleware uses these schemas
// Frontend forms use these schemas with React Hook Form
```

---

## Data Flow

### Create Todo Flow (End-to-End)

```mermaid
sequenceDiagram
    participant User
    participant WebUI
    participant ReactQuery
    participant APIClient
    participant Backend
    participant MongoDB
    participant WebSocket

    User->>WebUI: Click "Add Todo"
    WebUI->>WebUI: Open form modal
    User->>WebUI: Fill form & submit
    WebUI->>WebUI: Validate with Zod
    WebUI->>ReactQuery: mutate(todoData)
    ReactQuery->>ReactQuery: Optimistic update
    ReactQuery->>APIClient: POST /api/todos
    APIClient->>Backend: HTTP Request + JWT
    Backend->>Backend: Authenticate
    Backend->>Backend: Validate with Zod
    Backend->>MongoDB: Insert document
    MongoDB-->>Backend: Created todo
    Backend->>WebSocket: Emit 'todo:created'
    Backend-->>APIClient: 201 Created
    APIClient-->>ReactQuery: Response data
    ReactQuery->>ReactQuery: Update cache
    ReactQuery-->>WebUI: Success
    WebUI->>User: Show success message
    WebSocket-->>WebUI: Real-time update
```

### Authentication Token Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthStore
    participant APIClient
    participant Backend
    participant Redis

    Client->>Backend: POST /api/auth/login
    Backend->>Backend: Verify credentials
    Backend->>Backend: Generate access token (15min)
    Backend->>Backend: Generate refresh token (7d)
    Backend->>Redis: Store refresh token
    Backend-->>Client: { accessToken, refreshToken }
    Client->>AuthStore: Save tokens
    
    Note over Client,Backend: 15 minutes later...
    
    Client->>APIClient: Request with expired token
    APIClient->>Backend: GET /api/todos
    Backend-->>APIClient: 401 Unauthorized
    APIClient->>Backend: POST /api/auth/refresh-token
    Backend->>Redis: Verify refresh token
    Backend->>Backend: Generate new access token
    Backend->>Backend: Generate new refresh token
    Backend->>Redis: Store new refresh token
    Backend->>Redis: Delete old refresh token
    Backend-->>APIClient: { accessToken, refreshToken }
    APIClient->>AuthStore: Update tokens
    APIClient->>Backend: Retry GET /api/todos
    Backend-->>APIClient: 200 OK
```

---

## Security Architecture

### Security Layers

```mermaid
graph TD
    REQ[Incoming Request]
    
    REQ --> L1[Layer 1: Network Security]
    L1 --> L2[Layer 2: Application Security]
    L2 --> L3[Layer 3: Authentication]
    L3 --> L4[Layer 4: Authorization]
    L4 --> L5[Layer 5: Data Security]
    L5 --> RES[Response]
    
    L1 -.->|HTTPS, CORS, Rate Limiting| L1
    L2 -.->|Helmet, Input Validation| L2
    L3 -.->|JWT Verification| L3
    L4 -.->|User Scoping| L4
    L5 -.->|Encryption, Sanitization| L5
```

### Security Measures

1. **Network Security**
   - HTTPS in production
   - CORS with whitelist
   - Rate limiting (100 req/15min per IP)
   - DDoS protection

2. **Application Security**
   - Helmet.js security headers
   - Input validation with Zod
   - SQL injection prevention (Mongoose)
   - XSS protection

3. **Authentication**
   - JWT with RS256 algorithm
   - Bcrypt password hashing (10 rounds)
   - Refresh token rotation
   - OTP expiration (10 minutes)

4. **Authorization**
   - User-scoped data access
   - Protected routes with middleware
   - Role-based access control (ready)

5. **Data Security**
   - Passwords never stored in plain text
   - Sensitive data encryption
   - Redis TLS for cache
   - MongoDB encryption at rest

---

## Scalability Considerations

### Horizontal Scaling

```mermaid
graph TB
    LB[Load Balancer<br/>Nginx/AWS ALB]
    
    LB --> API1[API Server 1]
    LB --> API2[API Server 2]
    LB --> API3[API Server 3]
    
    API1 --> REDIS[(Redis<br/>Shared Cache)]
    API2 --> REDIS
    API3 --> REDIS
    
    API1 --> MONGO[(MongoDB<br/>Replica Set)]
    API2 --> MONGO
    API3 --> MONGO
    
    WS1[WebSocket Server 1] --> REDIS
    WS2[WebSocket Server 2] --> REDIS
    WS3[WebSocket Server 3] --> REDIS
```

### Scaling Strategies

1. **Stateless API**
   - No server-side sessions
   - JWT tokens for authentication
   - Redis for shared state

2. **Database Scaling**
   - MongoDB replica sets for read scaling
   - Sharding for write scaling
   - Indexes on frequently queried fields

3. **Caching Strategy**
   - Redis for OTP and refresh tokens
   - React Query for client-side caching
   - CDN for static assets

4. **WebSocket Scaling**
   - Redis adapter for Socket.IO
   - Sticky sessions for load balancing
   - Horizontal pod autoscaling

5. **Microservices Ready**
   - Service-based architecture
   - Clear service boundaries
   - Easy to extract into separate services

---

## Technology Decisions

### Why These Technologies?

| Technology | Reason |
|------------|--------|
| **TypeScript** | Type safety, better DX, fewer runtime errors |
| **Express.js** | Mature, flexible, large ecosystem |
| **MongoDB** | Flexible schema, great for rapid development |
| **Redis** | Fast caching, session management, pub/sub |
| **JWT** | Stateless, scalable, mobile-friendly |
| **Zod** | Runtime validation, type inference, shared schemas |
| **Next.js** | SSR, SEO, great DX, Vercel deployment |
| **Expo** | Faster development, OTA updates, managed workflow |
| **Zustand** | Simple, performant, TypeScript-first |
| **React Query** | Server state management, caching, optimistic updates |

---

## Future Architecture Considerations

1. **Microservices Migration**
   - Extract services into separate deployments
   - API Gateway (Kong, AWS API Gateway)
   - Service mesh (Istio)

2. **Event-Driven Architecture**
   - Message queue (RabbitMQ, Kafka)
   - Event sourcing
   - CQRS pattern

3. **GraphQL API**
   - Alternative to REST
   - Better for complex queries
   - Reduced over-fetching

4. **Serverless Functions**
   - AWS Lambda, Vercel Functions
   - Cost-effective for low traffic
   - Auto-scaling

5. **Observability**
   - Logging (Winston, Pino)
   - Monitoring (Prometheus, Grafana)
   - Tracing (Jaeger, OpenTelemetry)
   - Error tracking (Sentry)

---

## Conclusion

The Nexus monorepo architecture is designed for:
- ✅ **Developer Experience** - Type safety, hot reload, clear patterns
- ✅ **Scalability** - Horizontal scaling, caching, stateless design
- ✅ **Maintainability** - Clear separation of concerns, consistent patterns
- ✅ **Security** - Multiple security layers, best practices
- ✅ **Flexibility** - Easy to add features, extract services, migrate

For implementation details, see:
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed file organization
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Development workflow
- [CREATING_NEW_SERVICE.md](./CREATING_NEW_SERVICE.md) - Service creation guide
