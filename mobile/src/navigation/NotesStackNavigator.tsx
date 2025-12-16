import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesStackParamList } from './types';
import { useTheme } from '@hooks/useTheme';
import NotesScreen from '@screens/demo/NotesScreen';

/**
 * Notes Stack Navigator (Demo)
 * 
 * Placeholder navigation for the Notes feature.
 * Currently only has the main notes screen.
 */

const Stack = createNativeStackNavigator<NotesStackParamList>();

export default function NotesStackNavigator() {
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
        name="NotesTabs"
        component={NotesScreen}
        options={{
          title: 'Notes',
          headerShown: false, // NotesScreen has its own header
        }}
      />
    </Stack.Navigator>
  );
}
