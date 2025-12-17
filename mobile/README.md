# Nexus Mobile App

A cross-platform mobile productivity application built with React Native and Expo. Provides todo management, note-taking, and user authentication with a modern, theme-aware UI.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Start development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## 📋 Prerequisites

- Node.js 18+
- Yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Backend API running at `http://localhost:8000/api`

## 🏗️ Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Routing**: Expo Router (file-based)
- **UI Library**: Tamagui
- **State Management**: Zustand with MMKV persistence
- **Data Fetching**: TanStack Query
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Language**: TypeScript

## ✨ Features

### Authentication
- ✅ User registration with email/password
- ✅ Email verification with OTP
- ✅ Login with persistent sessions
- ✅ Forgot password flow
- ✅ Password reset with OTP
- ✅ Automatic token refresh

### Todo Management
- ✅ Create, read, update, delete todos
- ✅ Priority levels (Low, Medium, High)
- ✅ Filter by status (All, Active, Completed)
- ✅ Toggle completion status
- ✅ Pull-to-refresh
- ✅ Empty states

### Settings
- ✅ User profile display
- ✅ Light/Dark theme toggle
- ✅ Theme persistence
- ✅ Logout functionality

### UI/UX
- ✅ Onboarding slides for first-time users
- ✅ Smooth animations and transitions
- ✅ Responsive design
- ✅ Drawer navigation
- ✅ Bottom tabs
- ✅ Modal presentations

## 📁 Project Structure

```
mobile/
├── app/                    # File-based routing
│   ├── (auth)/            # Authentication screens
│   └── (main)/            # Main app screens
├── src/
│   ├── api/               # API client & endpoints
│   ├── components/        # Reusable components
│   ├── config/            # App configuration
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── assets/                # Static assets
└── tamagui.config.ts      # Tamagui configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
API_BASE_URL=http://localhost:8000/api
APP_NAME=Nexus
```

**Important**: For physical device testing, update `API_BASE_URL` to your machine's IP address:

```env
API_BASE_URL=http://192.168.1.x:8000/api
```

### Font Files

Download JetBrains Mono fonts from [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/) and place in `assets/fonts/`:
- `JetBrainsMono-Regular.ttf`
- `JetBrainsMono-Bold.ttf`

Or disable font loading in `app/_layout.tsx` to use system fonts.

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**: Detailed setup instructions and testing checklist
- **[Walkthrough](../brain/walkthrough.md)**: Complete implementation walkthrough
- **[Implementation Plan](../brain/implementation_plan.md)**: Original implementation plan

## 🧪 Testing

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for comprehensive testing checklist covering:
- Authentication flow
- Todo CRUD operations
- Navigation
- Theme switching
- Error handling

## 🛠️ Development

```bash
# Start dev server
yarn start

# Lint code
yarn lint

# Reset project (clear cache)
yarn reset-project
```

## 🚢 Deployment

Build for production using EAS Build:

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 📝 API Endpoints

The app connects to the following backend endpoints:

**Auth**:
- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/request-password-reset`
- `POST /auth/reset-password`

**Todos**:
- `GET /todos`
- `GET /todos/:id`
- `POST /todos`
- `PUT /todos/:id`
- `DELETE /todos/:id`

## 🐛 Troubleshooting

### Cannot connect to API
Update `API_BASE_URL` in `.env` to your machine's IP address.

### Font loading error
Add font files to `assets/fonts/` or disable font loading in `app/_layout.tsx`.

### Module not found
Run `yarn install` and restart the dev server.

## 🔮 Future Enhancements

- [ ] Due date picker for todos
- [ ] Full notes implementation
- [ ] Push notifications
- [ ] Offline sync
- [ ] Biometric authentication
- [ ] Todo categories/tags
- [ ] Search functionality
- [ ] Home screen widgets

## 📄 License

See [LICENSE](../LICENSE) file for details.

## 🤝 Contributing

This is part of the fullstack-master-repo project. See main README for contribution guidelines.

