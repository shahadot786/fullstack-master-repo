import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '@navigation/types';
import { loginSchema, LoginFormData } from '@utils/validation';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import * as authApi from '@api/auth.api';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Card from '@components/common/Card';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

/**
 * Login Screen
 * 
 * Allows users to log in with email and password.
 * Uses React Hook Form with Zod validation.
 * On successful login, stores tokens and navigates to main app.
 */
export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setAuth, setError } = useAuth();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with React Hook Form + Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle login form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call login API
      const response = await authApi.login(data);

      // Store auth data in Zustand store (which persists to MMKV)
      setAuth(response.user, response.accessToken, response.refreshToken);

      // Navigation to main app will happen automatically via AppNavigator
      // when isAuthenticated becomes true
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Header */}
          <Text style={[styles.title, isDark && styles.title_dark]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitle_dark]}>
            Sign in to continue to Nexus
          </Text>

          {/* Login Form */}
          <Card style={styles.card}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              )}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              variant="primary"
            />
          </Card>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, isDark && styles.footerText_dark]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 8,
    fontFamily: 'JetBrainsMono-Bold',
  },
  title_dark: {
    color: '#f5f5f5',
  },
  subtitle: {
    fontSize: 16,
    color: '#737373',
    marginBottom: 32,
    fontFamily: 'JetBrainsMono-Regular',
  },
  subtitle_dark: {
    color: '#a3a3a3',
  },
  card: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  footerText_dark: {
    color: '#a3a3a3',
  },
  linkText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Medium',
  },
});
