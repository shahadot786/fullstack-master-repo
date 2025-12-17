import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TodosTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3b82f6',
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
