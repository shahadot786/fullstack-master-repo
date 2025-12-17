import React from 'react';
import { Input as TamaguiInput, Label, YStack, Text, styled } from 'tamagui';

/**
 * Input Component
 * 
 * Reusable text input with label and error state.
 */

interface InputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const StyledInput = styled(TamaguiInput, {
    borderWidth: 1,
    borderColor: '$borderColor',
    borderRadius: '$3',
    paddingVertical: '$3',
    paddingHorizontal: '$4',
    fontSize: '$4',
    backgroundColor: '$background',
    color: '$color',

    focusStyle: {
        borderColor: '$borderColorFocus',
        outlineWidth: 0,
    },

    variants: {
        hasError: {
            true: {
                borderColor: '$error',
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
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
}) => {
    return (
        <YStack gap="$2" width="100%">
            <Label fontSize="$4" fontWeight="500" color="$color">
                {label}
            </Label>
            <StyledInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                hasError={!!error}
            />
            {error && (
                <Text fontSize="$3" color="$error">
                    {error}
                </Text>
            )}
        </YStack>
    );
};
