import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import type { AuthStackParamList } from '../../navigation/RootNavigator';

type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
    const route = useRoute<VerifyEmailScreenRouteProp>();
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const { verifyEmail, resendVerificationOTP, isLoading, error } = useAuthStore();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            return;
        }

        try {
            await verifyEmail({ email, otp });
        } catch (err) {
            // Error is handled by store
        }
    };

    const handleResend = async () => {
        try {
            await resendVerificationOTP(email);
            setCountdown(60);
        } catch (err) {
            // Error is handled by store
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>
                Verify Your Email
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                We sent a 6-digit code to{'\n'}
                <Text style={styles.email}>{email}</Text>
            </Text>

            {error && (
                <HelperText type="error" visible={!!error} style={styles.error}>
                    {error}
                </HelperText>
            )}

            <TextInput
                label="Verification Code"
                mode="outlined"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
                textAlign="center"
            />

            <Button
                mode="contained"
                onPress={handleVerify}
                loading={isLoading}
                disabled={isLoading || otp.length !== 6}
                style={styles.button}
            >
                Verify Email
            </Button>

            <Button
                mode="text"
                onPress={handleResend}
                disabled={isLoading || countdown > 0}
                style={styles.linkButton}
            >
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
        color: '#666',
    },
    email: {
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        marginBottom: 16,
        fontSize: 24,
        letterSpacing: 8,
    },
    button: {
        paddingVertical: 6,
    },
    linkButton: {
        marginTop: 8,
    },
    error: {
        marginBottom: 8,
        textAlign: 'center',
    },
});
