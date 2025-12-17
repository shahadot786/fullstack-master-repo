import { Stack } from 'expo-router';

export default function TodosLayout() {
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
                }}
            />
            <Stack.Screen
                name="edit/[id]"
                options={{
                    headerShown: true,
                    title: 'Edit Todo',
                }}
            />
        </Stack>
    );
}
