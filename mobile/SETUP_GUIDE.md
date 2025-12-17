# Nexus Mobile App - Setup & Testing Guide

## Prerequisites

Before running the app, ensure you have:

1. **Node.js 18+** and **Yarn** installed
2. **Expo CLI** installed globally: `npm install -g expo-cli`
3. **iOS Simulator** (Mac only) or **Android Emulator** set up
4. **Backend API** running at `http://localhost:8000/api`

## Installation Steps

### 1. Install Dependencies

```bash
cd /home/shahadot/Desktop/PersonalProjects/fullstack-master-repo/mobile
yarn install
```

### 2. Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

**Important**: If testing on a physical device or emulator, update `API_BASE_URL` in `.env` to your machine's IP address:

```
API_BASE_URL=http://192.168.1.x:8000/api
```

### 3. Add Font Files (Optional)

Download JetBrains Mono fonts from https://www.jetbrains.com/lp/mono/ and place:
- `JetBrainsMono-Regular.ttf`
- `JetBrainsMono-Bold.ttf`

in `assets/fonts/` directory.

**Alternative**: Comment out the font loading code in `app/_layout.tsx` (lines 32-35) to use system fonts.

### 4. Start the Backend

Ensure your backend is running:

```bash
cd /home/shahadot/Desktop/PersonalProjects/fullstack-master-repo/backend
yarn start
```

The backend should be accessible at `http://localhost:8000/api`.

### 5. Start the Mobile App

```bash
cd /home/shahadot/Desktop/PersonalProjects/fullstack-master-repo/mobile
yarn start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## Testing Checklist

### Authentication Flow

- [ ] **Onboarding**: On first launch, verify onboarding slides appear
  - Swipe through 3 slides
  - Test "Skip" button
  - Test "Get Started" button on last slide
  
- [ ] **Registration**:
  - Navigate to Register screen
  - Test validation (empty fields, invalid email, short password)
  - Register with: `test@example.com` / `Test User` / `password123`
  - Verify navigation to email verification screen
  
- [ ] **Email Verification**:
  - Check backend logs for OTP code
  - Enter OTP
  - Test "Resend OTP" with countdown timer
  - Verify navigation to login on success
  
- [ ] **Login**:
  - Login with verified credentials
  - Test "Remember Me" (close app, reopen - should stay logged in)
  - Test error handling for wrong password
  - Test error handling for unverified email
  
- [ ] **Password Reset**:
  - Click "Forgot Password?"
  - Enter email
  - Check backend logs for reset OTP
  - Enter OTP and new password
  - Login with new password

### Todo Management

- [ ] **View Todos**:
  - Navigate to Todos screen
  - Verify empty state displays
  - Switch between All/Active/Completed tabs
  
- [ ] **Create Todo**:
  - Tap floating action button (+)
  - Create todo with title "Buy groceries"
  - Set priority to "High"
  - Add description "Milk, eggs, bread"
  - Verify todo appears in "All" and "Active" tabs
  
- [ ] **Toggle Completion**:
  - Tap checkbox on todo card
  - Verify todo moves to "Completed" tab
  - Tap again to mark as active
  
- [ ] **Edit Todo**:
  - Tap on todo card
  - Edit title, description, priority
  - Save changes
  - Verify updates persist
  
- [ ] **Delete Todo**:
  - Tap trash icon on todo card
  - Confirm deletion
  - Verify todo is removed
  
- [ ] **Pull to Refresh**:
  - Pull down on todo list
  - Verify loading indicator appears
  - Verify todos refresh

### Settings & Theme

- [ ] **Settings Screen**:
  - Open drawer menu
  - Navigate to Settings
  - Verify user profile displays (name, email, verification status)
  
- [ ] **Theme Toggle**:
  - Toggle Dark Mode switch
  - Verify colors change throughout app
  - Close app and reopen
  - Verify theme persists
  
- [ ] **Logout**:
  - Tap Logout button
  - Confirm logout
  - Verify navigation to login screen
  - Verify cannot access protected routes

### Navigation

- [ ] **Drawer Navigation**:
  - Open drawer menu
  - Navigate to Todos
  - Navigate to Notes (placeholder)
  - Navigate to Settings
  
- [ ] **Back Navigation**:
  - Test back button on all screens
  - Verify proper navigation flow

### Error Handling

- [ ] **Network Errors**:
  - Stop backend server
  - Attempt to login
  - Verify error message displays
  
- [ ] **Token Refresh**:
  - Login and wait for token to expire (or manually invalidate)
  - Make an API request (e.g., fetch todos)
  - Verify token auto-refreshes
  - Verify request succeeds

## Common Issues

### Issue: "Cannot connect to API"
**Solution**: Update `API_BASE_URL` in `.env` to your machine's IP address instead of `localhost`.

### Issue: "Font loading error"
**Solution**: Either add the font files to `assets/fonts/` or comment out font loading in `app/_layout.tsx`.

### Issue: "Module not found" errors
**Solution**: Run `yarn install` and restart the dev server.

### Issue: "Expo Go app crashes"
**Solution**: Use development build instead: `npx expo run:ios` or `npx expo run:android`.

## Development Commands

```bash
# Start development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android

# Lint code
yarn lint

# Reset project (clear cache)
yarn reset-project
```

## Next Steps

After successful testing:

1. **Add Real Fonts**: Download and add JetBrains Mono fonts
2. **Configure API URL**: Set production API URL for deployment
3. **Build for Production**: Use EAS Build for app store deployment
4. **Add Tests**: Implement unit and integration tests
5. **Enhance Features**: Add push notifications, offline sync, etc.

## Support

For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [Tamagui Documentation](https://tamagui.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
