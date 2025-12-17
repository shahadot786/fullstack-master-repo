import React, { useState } from "react";
import { useRouter, Link, Href } from "expo-router";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { YStack, Text, H1 } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { loginSchema, LoginFormData } from "@/utils/validation";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login Data", data);
    setLoading(true);
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.replace("/(main)/(todos)" as Href);
    } catch (error: any) {
      const message = error.message || "Login failed";

      // Check if email not verified
      if (message.toLowerCase().includes("not verified")) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Verify Now",
              onPress: () =>
                router.push(
                  `/(auth)/verify-email?email=${encodeURIComponent(
                    data.email
                  )}` as Href
                ),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
      } else {
        console.log("Login Failed", message);
        Alert.alert("Login Failed", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          flex={1}
          padding="$6"
          justifyContent="center"
          gap="$2"
          backgroundColor="$background"
        >
          <YStack gap="$2" alignItems="center">
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 120, height: 120, marginBottom: 16 }}
              resizeMode="contain"
            />
            <H1 color="$color" fontSize="$10" fontWeight="700">
              Welcome Back
            </H1>
            <Text color="$color" opacity={0.7} fontSize="$5">
              Sign in to continue to Nexus
            </Text>
          </YStack>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
                showPasswordToggle={true}
              />
            )}
          />

          <Link href="/(auth)/forgot-password" asChild>
            <Text color="$primary" textAlign="right" marginTop="$2">
              Forgot Password?
            </Text>
          </Link>

          <Button
            title="Login"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
          />

          <YStack alignItems="center" marginTop="$4">
            <Text color="$color">
              Don&apos;t have an account?{" "}
              <Link href="/(auth)/register">
                <Text color="$primary" fontWeight="600">
                  Register
                </Text>
              </Link>
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
