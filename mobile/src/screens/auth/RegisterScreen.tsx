import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import type { AuthStackParamList } from '../../navigation/RootNavigator';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase, and number'
        ),
});

type RegisterForm = z.infer<typeof registerSchema>;
type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const { register, isLoading, error } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            const { needsVerification } = await register(data);
            if (needsVerification) {
                navigation.navigate('VerifyEmail', { email: data.email });
            }
        } catch (err) {
            // Error is handled by store
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text variant="headlineLarge" style={styles.title}>
                        Create Account
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Sign up to get started
                    </Text>

                    {error && (
                        <HelperText type="error" visible={!!error} style={styles.error}>
                            {error}
                        </HelperText>
                    )}

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Full Name"
                                mode="outlined"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={!!errors.name}
                                style={styles.input}
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.name}>
                        {errors.name?.message}
                    </HelperText>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Email"
                                mode="outlined"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={!!errors.email}
                                style={styles.input}
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.email}>
                        {errors.email?.message}
                    </HelperText>

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Password"
                                mode="outlined"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry={!showPassword}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                                error={!!errors.password}
                                style={styles.input}
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.password}>
                        {errors.password?.message}
                    </HelperText>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.button}
                    >
                        Create Account
                    </Button>

                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkButton}
                    >
                        Already have an account? Sign In
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
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
    input: {
        marginBottom: 4,
    },
    button: {
        marginTop: 16,
        paddingVertical: 6,
    },
    linkButton: {
        marginTop: 8,
    },
    error: {
        marginBottom: 8,
    },
});
