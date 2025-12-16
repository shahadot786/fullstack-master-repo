import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { MainDrawerParamList } from './types';
import { useTheme } from '@hooks/useTheme';
import TodoStackNavigator from './TodoStackNavigator';
import NotesStackNavigator from './NotesStackNavigator';
import SettingsScreen from '@screens/settings/SettingsScreen';

/**
 * Main Drawer Navigator
 * 
 * The main app navigation with drawer sidebar.
 * Provides access to:
 * - Todos (with nested stack and tabs)
 * - Notes (demo feature)
 * - Settings
 */

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export default function MainNavigator() {
  const { isDark } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? '#262626' : '#ffffff',
        },
        headerTintColor: isDark ? '#f5f5f5' : '#262626',
        headerTitleStyle: {
          fontFamily: 'JetBrainsMono-Bold',
        },
        drawerStyle: {
          backgroundColor: isDark ? '#262626' : '#ffffff',
        },
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: isDark ? '#a3a3a3' : '#737373',
        drawerLabelStyle: {
          fontFamily: 'JetBrainsMono-Medium',
        },
      }}
    >
      <Drawer.Screen
        name="TodosStack"
        component={TodoStackNavigator}
        options={{
          title: 'Todos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
          headerShown: false, // TodoStack has its own header
        }}
      />

      <Drawer.Screen
        name="NotesStack"
        component={NotesStackNavigator}
        options={{
          title: 'Notes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
          headerShown: false, // NotesStack has its own header
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
