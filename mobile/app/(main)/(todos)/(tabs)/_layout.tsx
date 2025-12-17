import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useTheme as useTamaguiTheme } from 'tamagui';
import { useTheme } from '@/hooks/useTheme';

export default function TodosTabsLayout() {
    const { isDark } = useTheme();
    const tamaguiTheme = useTamaguiTheme();
    const colorScheme = useColorScheme();

    // Determine colors based on theme - using darker scheme for dark mode
    const backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
    const headerTintColor = isDark ? '#fafafa' : '#171717';
    const tabBarBackgroundColor = isDark ? '#1a1a1a' : '#ffffff';
    const tabBarInactiveTintColor = isDark ? '#6b7280' : '#737373';
    const borderColor = isDark ? '#262626' : '#e5e5e5';

    return (
        <Tabs
            screenOptions={{
                headerShown: false, // Remove header to hide logo
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
