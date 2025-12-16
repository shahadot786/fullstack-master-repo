import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

/**
 * Input Component Props
 */
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * Custom Input Component
 * 
 * A reusable text input component with label and error states.
 * Supports theming (light/dark mode).
 * 
 * Usage:
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={errors.email}
 *   keyboardType="email-address"
 * />
 */
export default function Input({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}: InputProps) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isDark && styles.label_dark]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isDark ? styles.input_dark : styles.input_light,
          error && styles.input_error,
          style,
        ]}
        placeholderTextColor={isDark ? '#737373' : '#a3a3a3'}
        {...textInputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#262626',
    fontFamily: 'JetBrainsMono-Medium',
  },
  label_dark: {
    color: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'JetBrainsMono-Regular',
  },
  input_light: {
    backgroundColor: '#ffffff',
    borderColor: '#d4d4d4',
    color: '#262626',
  },
  input_dark: {
    backgroundColor: '#262626',
    borderColor: '#404040',
    color: '#f5f5f5',
  },
  input_error: {
    borderColor: '#dc2626',
  },
  error: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    fontFamily: 'JetBrainsMono-Regular',
  },
});
