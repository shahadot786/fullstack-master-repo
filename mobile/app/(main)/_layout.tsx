import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View, SafeAreaView } from 'react-native';
import { Text, YStack } from 'tamagui';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function MainLayout() {
    const { logout } = useAuth();
    const { isDark } = useTheme();

    // Determine colors based on theme - using darker scheme for dark mode
    const backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
    const drawerBackgroundColor = isDark ? '#1a1a1a' : '#ffffff';
    const drawerInactiveTintColor = isDark ? '#6b7280' : '#737373';
    const headerTintColor = isDark ? '#fafafa' : '#171717';

    return (
        <Drawer
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: '#3b82f6',
                drawerInactiveTintColor: drawerInactiveTintColor,
                drawerStyle: {
                    backgroundColor: drawerBackgroundColor,
                },
            }}
            drawerContent={(props) => (
                <SafeAreaView style={{ flex: 1, backgroundColor: drawerBackgroundColor }}>
                    <DrawerContentScrollView {...props}>
                        <View
                            style={{
                                paddingBottom: 10,
                                paddingHorizontal: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: isDark ? '#262626' : '#e5e5e5',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}
                        >
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{ width: 80, height: 80 }}
                                resizeMode="contain"
                            />
                        </View>
                        <DrawerItemList {...props} />
                    </DrawerContentScrollView>
                </SafeAreaView>
            )}
        >
            <Drawer.Screen
                name="(todos)"
                options={{
                    drawerLabel: 'Todos',
                    title: 'Todos',
                    headerTitle: () => (
                        <YStack alignItems="flex-start">
                            <Text fontSize="$6" fontWeight="700" color="$color">
                                Todos
                            </Text>
                        </YStack>
                    ),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="checkbox" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="notes"
                options={{
                    drawerLabel: 'Notes',
                    title: 'Notes',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="document-text" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="chat"
                options={{
                    drawerLabel: 'Chat',
                    title: 'Chat',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="ai"
                options={{
                    drawerLabel: 'AI Assistant',
                    title: 'AI Assistant',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="sparkles" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="shop"
                options={{
                    drawerLabel: 'Shop',
                    title: 'Shop',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="storefront" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="social"
                options={{
                    drawerLabel: 'Social',
                    title: 'Social',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="delivery"
                options={{
                    drawerLabel: 'Delivery',
                    title: 'Delivery',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="bicycle" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="expense"
                options={{
                    drawerLabel: 'Expense Tracker',
                    title: 'Expense Tracker',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="weather"
                options={{
                    drawerLabel: 'Weather',
                    title: 'Weather',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="partly-sunny" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="urlshort"
                options={{
                    drawerLabel: 'URL Shortener',
                    title: 'URL Shortener',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="link" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: 'Settings',
                    title: 'Settings',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}
