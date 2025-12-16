import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from '@tamagui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import tamaguiConfig from './tamagui.config';
import ErrorBoundary from '@components/ErrorBoundary';
import { useTheme } from '@hooks/useTheme';
import { View, Text, Image, StyleSheet } from 'react-native';

/**
 * Main App Component
 * 
 * This is the root component of the application.
 * It sets up all the providers and handles app initialization.
 * 
 * Providers:
 * - ErrorBoundary: Catches and handles errors
 * - GestureHandlerRootView: Required for react-native-gesture-handler
 * - TamaguiProvider: Provides Tamagui theme context
 * - QueryClientProvider: Provides Tanstack Query context
 */

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a QueryClient instance for Tanstack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests twice
      staleTime: 60000, // Consider data fresh for 1 minute
      refetchOnWindowFocus: false, // Don't refetch when app comes to foreground
    },
  },
});

/**
 * App Content Component
 * This component is wrapped by providers and handles the main app logic
 */
function AppContent() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { mode } = useTheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          // JetBrains Mono fonts (matching web)
          'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
          'JetBrainsMono-Bold': require('./assets/fonts/JetBrainsMono-Bold.ttf'),
          'JetBrainsMono-Medium': require('./assets/fonts/JetBrainsMono-Medium.ttf'),
        });

        // Artificially delay for splash screen demo (remove in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide splash screen when app is ready
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Show splash screen while loading
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('./assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Nexus</Text>
      </View>
    );
  }

  // TODO: Replace with actual navigation
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Nexus Mobile!</Text>
      <Text style={styles.subtext}>Theme: {mode}</Text>
      <Text style={styles.info}>
        The app is ready! Navigation and screens will be added next.
      </Text>
    </View>
  );
}

/**
 * Root App Component with Providers
 */
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <TamaguiProvider config={tamaguiConfig}>
            <AppContent />
            <StatusBar style="auto" />
          </TamaguiProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: '#525252',
    marginBottom: 24,
  },
  info: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    maxWidth: 300,
  },
});
