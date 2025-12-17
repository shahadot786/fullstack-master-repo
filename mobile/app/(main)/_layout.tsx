import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function MainLayout() {
    const { logout } = useAuth();

    return (
        <Drawer
            screenOptions={{
                headerShown: true,
                drawerActiveTintColor: '#3b82f6',
            }}
        >
            <Drawer.Screen
                name="(todos)"
                options={{
                    drawerLabel: 'Todos',
                    title: 'Todos',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="checkmark-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="notes"
                options={{
                    drawerLabel: 'Notes',
                    title: 'Notes',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: 'Settings',
                    title: 'Settings',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}
