import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

/**
 * Button Component Props
 */
interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Custom Button Component
 * 
 * A reusable button component with multiple variants and states.
 * Supports theming (light/dark mode) and loading states.
 * 
 * Usage:
 * <Button 
 *   title="Login" 
 *   onPress={handleLogin}
 *   variant="primary"
 *   loading={isLoading}
 * />
 */
export default function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const { isDark } = useTheme();

  // Determine button styles based on variant and theme
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`button_${size}`],
      ...(fullWidth && { width: '100%' }),
    };

    if (disabled || loading) {
      return { ...baseStyle, ...styles.button_disabled };
    }

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: '#2563eb' };
      case 'secondary':
        return { ...baseStyle, backgroundColor: isDark ? '#7c3aed' : '#8b5cf6' };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: isDark ? '#3b82f6' : '#2563eb',
        };
      case 'danger':
        return { ...baseStyle, backgroundColor: '#dc2626' };
      default:
        return baseStyle;
    }
  };

  // Determine text styles based on variant and theme
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`text_${size}`],
    };

    if (disabled || loading) {
      return { ...baseStyle, color: '#a3a3a3' };
    }

    if (variant === 'outline') {
      return { ...baseStyle, color: isDark ? '#3b82f6' : '#2563eb' };
    }

    return { ...baseStyle, color: '#ffffff' };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563eb' : '#ffffff'} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  button_disabled: {
    backgroundColor: '#e5e5e5',
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Medium',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});
