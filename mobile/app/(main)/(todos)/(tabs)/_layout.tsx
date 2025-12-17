import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function TodosTabsLayout() {
    const { isDark } = useTheme();

    // Determine colors based on theme - using darker scheme for dark mode
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
                    title: 'All',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="active"
                options={{
                    title: 'Active',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="radio-button-off" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="completed"
                options={{
                    title: 'Completed',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="checkmark-circle" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
