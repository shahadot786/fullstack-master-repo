import React from 'react';
import { Button as TamaguiButton, Spinner, styled } from 'tamagui';

/**
 * Button Component
 * 
 * Reusable button with variants and loading state.
 */

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

const StyledButton = styled(TamaguiButton, {
    borderRadius: '$4',
    paddingVertical: '$3',
    paddingHorizontal: '$4',
    fontSize: '$5',
    fontWeight: '600',

    variants: {
        variant: {
            primary: {
                backgroundColor: '$primary',
                color: '$white',
                hoverStyle: {
                    backgroundColor: '$primaryHover',
                },
                pressStyle: {
                    backgroundColor: '$primaryPress',
                },
            },
            secondary: {
                backgroundColor: '$secondary',
                color: '$white',
                hoverStyle: {
                    backgroundColor: '$secondaryHover',
                },
                pressStyle: {
                    backgroundColor: '$secondaryPress',
                },
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$borderColor',
                color: '$color',
                hoverStyle: {
                    borderColor: '$borderColorHover',
                    backgroundColor: '$backgroundHover',
                },
                pressStyle: {
                    borderColor: '$borderColorPress',
                    backgroundColor: '$backgroundPress',
                },
            },
        },
        fullWidth: {
            true: {
                width: '100%',
            },
        },
        disabled: {
            true: {
                opacity: 0.5,
                cursor: 'not-allowed',
            },
        },
    } as const,
});

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = false,
}) => {
    return (
        <StyledButton
            variant={variant}
            fullWidth={fullWidth}
            disabled={disabled || loading}
            onPress={onPress}
            icon={loading ? <Spinner size="small" color="$white" /> : undefined}
        >
            {!loading && title}
        </StyledButton>
    );
};
