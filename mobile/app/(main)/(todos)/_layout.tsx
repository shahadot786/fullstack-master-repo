import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function TodosLayout() {
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
                name="create"
                options={{
                    presentation: 'modal',
                    headerShown: true,
                    title: 'Create Todo',
                    headerStyle: {
                        backgroundColor: backgroundColor,
                    },
                    headerTintColor: headerTintColor,
                }}
            />
            <Stack.Screen
                name="edit/[id]"
                options={{
                    headerShown: true,
                    title: 'Edit Todo',
                    headerStyle: {
                        backgroundColor: backgroundColor,
                    },
                    headerTintColor: headerTintColor,
                }}
            />
        </Stack>
    );
}
