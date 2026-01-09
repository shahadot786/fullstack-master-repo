import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function ChatTabsLayout() {
  const { isDark } = useTheme();

  const tabBarBackgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const tabBarInactiveTintColor = isDark ? '#6b7280' : '#737373';
  const borderColor = isDark ? '#262626' : '#e5e5e5';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopColor: borderColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Direct',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shoutbox"
        options={{
          title: 'Shoutbox',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
