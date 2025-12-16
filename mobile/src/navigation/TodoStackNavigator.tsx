import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoStackParamList } from './types';
import { useTheme } from '@hooks/useTheme';
import TodoTabsNavigator from './TodoTabsNavigator';
import CreateTodoScreen from '@screens/todos/CreateTodoScreen';
import EditTodoScreen from '@screens/todos/EditTodoScreen';

/**
 * Todo Stack Navigator
 * 
 * Manages the todo-related screens:
 * - TodoTabs (bottom tabs with All/Active/Completed)
 * - CreateTodo
 * - EditTodo
 * - TodoDetail (future)
 */

const Stack = createNativeStackNavigator<TodoStackParamList>();

export default function TodoStackNavigator() {
  const { isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#262626' : '#ffffff',
        },
        headerTintColor: isDark ? '#f5f5f5' : '#262626',
        headerTitleStyle: {
          fontFamily: 'JetBrainsMono-Bold',
        },
      }}
    >
      <Stack.Screen
        name="TodoTabs"
        component={TodoTabsNavigator}
        options={{
          title: 'Todos',
        }}
      />

      <Stack.Screen
        name="CreateTodo"
        component={CreateTodoScreen}
        options={({ navigation }) => ({
          title: 'Create Todo',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="close"
                size={28}
                color={isDark ? '#f5f5f5' : '#262626'}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="EditTodo"
        component={EditTodoScreen}
        options={({ navigation }) => ({
          title: 'Edit Todo',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="close"
                size={28}
                color={isDark ? '#f5f5f5' : '#262626'}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
