import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="conversation/[id]" />
      <Stack.Screen name="conversation/settings" options={{ presentation: 'modal', headerShown: true, title: 'Chat Settings' }} />
      <Stack.Screen name="new-chat" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
