import React, { useState } from "react";
import { Pressable } from "react-native";
import { Input as TamaguiInput, Label, YStack, XStack, Text, styled } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

/**
 * Input Component
 *
 * Reusable text input with label and error state.
 * Supports password visibility toggle.
 */

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
}

const StyledInput = styled(TamaguiInput, {
  borderWidth: 1.5,
  borderColor: "$borderColor",
  borderRadius: "$4",
  paddingVertical: "$0",
  paddingHorizontal: "$4",
  fontSize: "$4",
  backgroundColor: "$background",
  color: "$color",

  focusStyle: {
    borderColor: "$borderColorFocus",
    borderWidth: 2,
    outlineWidth: 0,
  },

  variants: {
    hasError: {
      true: {
        borderColor: "$error",
        borderWidth: 1.5,
      },
    },
  } as const,
});

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  showPasswordToggle = false,
  autoCapitalize = "none",
  maxLength,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { isDark } = useTheme();

  const actualSecureEntry = secureTextEntry && !isPasswordVisible;

  return (
    <YStack gap="$2" width="100%">
      <Label fontSize="$4" fontWeight="500" color="$color">
        {label}
      </Label>
      <XStack position="relative" width="100%">
        <StyledInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={actualSecureEntry}
          autoCapitalize={autoCapitalize}
          hasError={!!error}
          flex={1}
          paddingRight={showPasswordToggle && secureTextEntry ? "$10" : "$4"}
          maxLength={maxLength}
        />
        {showPasswordToggle && secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              width: 40,
            }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </Pressable>
        )}
      </XStack>
      {error && (
        <Text fontSize="$3" color="$error">
          {error}
        </Text>
      )}
    </YStack>
  );
};
