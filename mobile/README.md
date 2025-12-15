# Mobile Application

React Native mobile application built with Expo.

## Features

- ✅ **React Native** with Expo
- ✅ **TypeScript** for type safety
- ✅ **React Navigation** for navigation
- ✅ **Zustand** for state management
- ✅ **React Hook Form** + Zod validation
- ✅ **Axios** with automatic token refresh
- ✅ **MMKV** for fast and secure storage
- ✅ **React Native Paper** for UI components
- ✅ **Authentication** (login, register, email verification)
- ✅ **TODO Management** with CRUD operations

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
cd mobile
npm install
```

### Configuration

Create `.env` file:

```env
API_URL=http://10.0.2.2:8000/api  # Android emulator
# API_URL=http://localhost:8000/api  # iOS simulator
WS_URL=http://10.0.2.2:8000
```

**Note**: 
- Android emulator uses `10.0.2.2` to access host machine's localhost
- iOS simulator can use `localhost` directly
- For physical devices, use your computer's IP address (e.g., `http://192.168.1.100:8000/api`)

### Run

```bash
# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
src/
├── screens/          # Screen components
│   ├── auth/        # Authentication screens
│   └── todos/       # TODO screens
├── components/      # Reusable components
├── navigation/      # Navigation configuration
├── store/           # Zustand stores
├── services/        # API services
├── utils/           # Utilities
└── types/           # TypeScript types
```

## Implementation Status

### ✅ Completed
- Expo project setup
- TypeScript configuration
- Dependencies installed
- MMKV storage utility
- API client with token refresh
- Auth store with Zustand
- TODO store with Zustand
- TypeScript types

### 🚧 To Implement
- Navigation setup
- Authentication screens
- TODO screens
- UI components
- Form validation

## Storage

Using **MMKV** for fast and secure storage:
- 30x faster than AsyncStorage
- Synchronous API
- Encrypted storage
- Small bundle size

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on Web
npm run lint       # Run ESLint
```

## Building for Production

### Using EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Next Steps

1. Create navigation structure
2. Build authentication screens
3. Implement TODO screens
4. Add form validation
5. Create reusable UI components
6. Add loading and error states
7. Implement pull-to-refresh
8. Add swipe actions
9. Test on physical devices
10. Deploy to app stores

## License

MIT
