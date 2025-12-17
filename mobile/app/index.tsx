import { useEffect } from 'react';
import { useRouter, useSegments, Href } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';

export default function Index() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);

  useEffect(() => {
    // Wait a moment for hydration
    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';
      const inMainGroup = segments[0] === '(main)';

      if (!onboardingCompleted) {
        // Show onboarding
        router.replace('/onboarding' as Href);
      } else if (!isAuthenticated && !inAuthGroup) {
        // Not authenticated, redirect to login
        router.replace('/(auth)/login' as Href);
      } else if (isAuthenticated && !inMainGroup) {
        // Authenticated, redirect to main app
        router.replace('/(main)/(todos)' as Href);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, onboardingCompleted, segments]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
