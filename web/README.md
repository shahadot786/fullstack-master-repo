# Web Application

Next.js 14 web application with authentication, TODO management, and real-time features.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **TailwindCSS** for styling
- ✅ **Zustand** for state management
- ✅ **React Hook Form** + Zod validation
- ✅ **Axios** with automatic token refresh
- ✅ **Socket.IO** for real-time updates
- ✅ **Authentication** (login, register, email verification, password reset)
- ✅ **TODO Management** with CRUD operations

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=http://localhost:8000

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register, etc.)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── auth/                # Auth components
│   ├── todos/               # TODO components
│   ├── ui/                  # Reusable UI components
│   └── layout/              # Layout components
├── lib/
│   ├── api/                 # API client
│   ├── store/               # Zustand stores
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utilities
└── types/                   # TypeScript types
```

## Implementation Status

### ✅ Completed
- Next.js 14 project setup
- TypeScript configuration
- TailwindCSS setup
- Dependencies installed (zustand, axios, socket.io-client, react-hook-form, zod, lucide-react, react-hot-toast, date-fns)
- API client with token refresh (`src/lib/api/client.ts`)
- TypeScript types (`src/types/index.ts`)
- Auth store with Zustand (`src/lib/store/auth.ts`)

### 🚧 To Implement
- TODO store
- Authentication pages (login, register, verify-email, reset-password)
- Dashboard layout
- TODO management UI
- WebSocket integration
- Protected route middleware
- UI components

## Core Implementation

See the implementation plan and code examples in the sections below.

### API Client

Located at `src/lib/api/client.ts` - Axios instance with:
- Automatic token attachment
- Token refresh on 401
- Error handling

### Auth Store

Located at `src/lib/store/auth.ts` - Zustand store with:
- Login/Register/Logout
- Email verification
- Password reset
- Persistent storage

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Next Steps

1. Create TODO store
2. Build authentication pages
3. Implement dashboard layout
4. Add TODO management UI
5. Integrate WebSocket
6. Add protected routes
7. Create reusable UI components
8. Add responsive design
9. Implement error/loading states
10. Deploy to Vercel

For detailed implementation examples, see `/docs/WEB_IMPLEMENTATION.md`

## License

MIT
