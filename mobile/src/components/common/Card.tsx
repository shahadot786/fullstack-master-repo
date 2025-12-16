import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

/**
 * Card Component Props
 */
interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Card Component
 * 
 * A simple container component with elevation/shadow and theme support.
 * 
 * Usage:
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 */
export default function Card({ children, style }: CardProps) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        isDark ? styles.card_dark : styles.card_light,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card_light: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  card_dark: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
  },
});
