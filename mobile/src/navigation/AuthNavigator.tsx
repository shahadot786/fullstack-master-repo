import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import screens (will be created next)
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import VerifyEmailScreen from '@screens/auth/VerifyEmailScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '@screens/auth/ResetPasswordScreen';

/**
 * Auth Stack Navigator
 * 
 * This navigator handles all authentication-related screens.
 * It's a stack navigator, so screens are pushed and popped like a stack.
 * 
 * Flow:
 * 1. User starts at Login
 * 2. Can navigate to Register
 * 3. After Register, goes to VerifyEmail
 * 4. Can also go to ForgotPassword from Login
 * 5. After ForgotPassword, goes to ResetPassword
 */

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide header for all auth screens
        animation: 'slide_from_right', // Smooth slide animation
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
