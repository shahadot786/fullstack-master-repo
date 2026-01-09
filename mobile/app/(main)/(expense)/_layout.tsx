import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function ExpenseLayout() {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
  const headerTintColor = isDark ? '#fafafa' : '#171717';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Add Expense',
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: headerTintColor,
        }}
      />
    </Stack>
  );
}
