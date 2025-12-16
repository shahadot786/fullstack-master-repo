import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '@navigation/types';
import { verifyEmailSchema, VerifyEmailFormData } from '@utils/validation';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import * as authApi from '@api/auth.api';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Card from '@components/common/Card';

type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailScreenRouteProp>();
  const { setAuth } = useAuth();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { email } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email,
      otp: '',
    },
  });

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.verifyEmail(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      setError(null);

      await authApi.resendOTP({ email });
      setResendCooldown(60); // 60 second cooldown
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
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
          <Text style={[styles.title, isDark && styles.title_dark]}>
            Verify Email
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitle_dark]}>
            We've sent a 6-digit code to {email}
          </Text>

          <Card style={styles.card}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.otp?.message}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              )}
            />

            <Button
              title="Verify Email"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              variant="primary"
            />

            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resendCooldown > 0 || isResending}
              style={styles.resendButton}
            >
              <Text style={[
                styles.resendText,
                (resendCooldown > 0 || isResending) && styles.resendText_disabled
              ]}>
                {isResending
                  ? 'Sending...'
                  : resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </Card>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
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
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Regular',
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    color: '#2563eb',
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Medium',
  },
  resendText_disabled: {
    color: '#a3a3a3',
  },
  backText: {
    fontSize: 14,
    color: '#2563eb',
    textAlign: 'center',
    fontFamily: 'JetBrainsMono-Medium',
  },
});
