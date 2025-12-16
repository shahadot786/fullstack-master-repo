import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TodoTabParamList } from '@navigation/types';
import { useTheme } from '@hooks/useTheme';
import TodoListScreen from '@screens/todos/TodoListScreen';

/**
 * Todo Bottom Tabs Navigator
 * 
 * Provides tab-based navigation for different todo views:
 * - All Todos
 * - Active Todos (not completed)
 * - Completed Todos
 */

const Tab = createBottomTabNavigator<TodoTabParamList>();

export default function TodoTabsNavigator() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: isDark ? '#737373' : '#a3a3a3',
        tabBarStyle: {
          backgroundColor: isDark ? '#262626' : '#ffffff',
          borderTopColor: isDark ? '#404040' : '#e5e5e5',
        },
        tabBarLabelStyle: {
          fontFamily: 'JetBrainsMono-Medium',
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="AllTodos"
        options={{
          title: 'All',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      >
        {() => <TodoListScreen filter="all" />}
      </Tab.Screen>

      <Tab.Screen
        name="ActiveTodos"
        options={{
          title: 'Active',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio-button-off" size={size} color={color} />
          ),
        }}
      >
        {() => <TodoListScreen filter="active" />}
      </Tab.Screen>

      <Tab.Screen
        name="CompletedTodos"
        options={{
          title: 'Completed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
        }}
      >
        {() => <TodoListScreen filter="completed" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
