import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';

// Main Screens
import TodoListScreen from '../screens/todos/TodoListScreen';
import CreateTodoScreen from '../screens/todos/CreateTodoScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    VerifyEmail: { email: string };
};

export type TodoStackParamList = {
    TodoList: undefined;
    CreateTodo: undefined;
};

export type MainTabParamList = {
    Todos: undefined;
    Profile: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const TodoStack = createStackNavigator<TodoStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
            <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </AuthStack.Navigator>
    );
}

function TodoNavigator() {
    return (
        <TodoStack.Navigator>
            <TodoStack.Screen
                name="TodoList"
                component={TodoListScreen}
                options={{ title: 'My TODOs' }}
            />
            <TodoStack.Screen
                name="CreateTodo"
                component={CreateTodoScreen}
                options={{ title: 'Create TODO' }}
            />
        </TodoStack.Navigator>
    );
}

function MainNavigator() {
    return (
        <MainTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Todos') {
                        iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                    } else {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6366f1',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <MainTab.Screen
                name="Todos"
                component={TodoNavigator}
                options={{ headerShown: false }}
            />
            <MainTab.Screen name="Profile" component={ProfileScreen} />
        </MainTab.Navigator>
    );
}

export default function RootNavigator() {
    const { isAuthenticated, loadUser } = useAuthStore();

    React.useEffect(() => {
        loadUser();
    }, []);

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
