import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { useAuth } from '@hooks/useAuth';
import { useAppStore } from '@store/appStore';

// Import navigators and screens
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '@screens/SplashScreen';
import OnboardingScreen from '@screens/onboarding/OnboardingScreen';

/**
 * Root App Navigator
 * 
 * This is the top-level navigator that manages the app's navigation state.
 * It switches between different navigation stacks based on app state:
 * 
 * 1. Splash Screen - Initial loading
 * 2. Onboarding - First-time user experience
 * 3. Auth Stack - Login/Register flow
 * 4. Main Stack - Authenticated app content
 * 
 * The navigation flow is determined by:
 * - onboardingCompleted (from MMKV storage)
 * - isAuthenticated (from auth store)
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const { onboardingCompleted } = useAppStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide header for all screens
          animation: 'fade', // Smooth fade animation between stacks
        }}
      >
        {!onboardingCompleted ? (
          // Show onboarding for first-time users
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          // Show auth flow if not authenticated
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Show main app if authenticated
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
