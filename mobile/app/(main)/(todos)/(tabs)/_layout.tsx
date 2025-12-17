import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';
import { Text, XStack } from 'tamagui';

export default function TodosTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#3b82f6',
                headerStyle: {
                    backgroundColor: '#ffffff',
                },
                headerTitle: () => (
                    <XStack alignItems="center" gap="$3">
                        <Image
                            source={require('../../../../assets/images/logo.png')}
                            style={{ width: 32, height: 32 }}
                            resizeMode="contain"
                        />
                        <Text fontSize="$6" fontWeight="700" color="$color">
                            Nexus
                        </Text>
                    </XStack>
                ),
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
