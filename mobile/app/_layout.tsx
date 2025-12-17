import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import tamaguiConfig from '../tamagui.config';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/hooks/useTheme';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const { theme } = useTheme();
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const hydrateApp = useAppStore((state) => state.hydrate);

  // Load fonts
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
  });

  useEffect(() => {
    // Hydrate stores from storage
    hydrateAuth();
    hydrateApp();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
          </Stack>
        </QueryClientProvider>
      </TamaguiProvider>
    </ErrorBoundary>
  );
}
