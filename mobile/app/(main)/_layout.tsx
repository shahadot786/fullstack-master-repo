import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View } from 'react-native';
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
                headerShown: true,
                drawerActiveTintColor: '#3b82f6',
                drawerInactiveTintColor: drawerInactiveTintColor,
                headerStyle: {
                    backgroundColor: backgroundColor,
                },
                headerTintColor: headerTintColor,
                drawerStyle: {
                    backgroundColor: drawerBackgroundColor,
                },
                drawerLabelStyle: {
                    marginLeft: -16,
                },
            }}
            drawerContent={(props) => (
                <View style={{ flex: 1 }}>
                    <DrawerContentScrollView {...props}>
                        <View
                            style={{
                                padding: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: isDark ? '#262626' : '#e5e5e5',
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../assets/images/icon.png')}
                                style={{ width: 40, height: 40, marginRight: 10 }}
                            />
                            <Text fontSize="$6" fontWeight="700" color={headerTintColor}>
                                My App
                            </Text>
                        </View>
                        <DrawerItemList {...props} />
                    </DrawerContentScrollView>
                </View>
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
