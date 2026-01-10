# Nexus Web Application

A modern, high-performance web dashboard built with Next.js 15, Tailwind CSS, and TanStack Query.

## ✨ Features

- **Auth System** - Full authentication flow with secure cookie-based session management.
- **Real-time Chat** - Private messaging and global Shoutbox with Socket.IO.
- **Expense Dashboard** - Visualize spending with custom categories and analytics.
- **Weather** - Dynamic weather dashboard with location-based data.
- **Todo Management** - Advanced todo list with priority levels and filtering.
- **URL Shortener** - Management dashboard for shortening and tracking links.
- **Analytics** - Data-driven insights into your productivity and usage.
- **Responsive Design** - Optimized for all screen sizes with dark/light mode support.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand (Client) + TanStack Query (Server)
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.IO Client
- **Authentication**: JWT via HTTP-only Cookies

## 🛠️ Getting Started

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Project Structure

- `app/` - Next.js App Router and page definitions.
- `components/` - Shared UI and feature-specific components.
- `lib/` - API clients, state stores, and utility functions.
- `hooks/` - Custom React hooks for data fetching and UI logic.
- `types/` - Shared TypeScript interfaces.

## 📖 Documentation

For detailed information on the full stack structure, see the [main README](../README.md).
