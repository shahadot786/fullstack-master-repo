import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { useAuth } from '@hooks/useAuth';
import { useAppStore } from '@store/appStore';

// Import navigators and screens
import AuthNavigator from './AuthNavigator';
import SplashScreen from '@screens/SplashScreen';
import OnboardingScreen from '@screens/onboarding/OnboardingScreen';
// MainNavigator will be created next
// import MainNavigator from './MainNavigator';

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
          // TODO: Replace with MainNavigator once created
          <Stack.Screen name="Main" component={PlaceholderMainScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Temporary placeholder for main app
 * This will be replaced with MainNavigator
 */
function PlaceholderMainScreen() {
  const { logout } = useAuth();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Main App (Coming Soon)</Text>
      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#2563eb',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// Import View, Text, TouchableOpacity for placeholder
import { View, Text, TouchableOpacity } from 'react-native';
