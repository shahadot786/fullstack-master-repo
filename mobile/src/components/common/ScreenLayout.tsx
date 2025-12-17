import React from 'react';
import { YStack } from 'tamagui';
import { HeaderIcons } from './HeaderIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * ScreenLayout Component
 * 
 * Common layout wrapper for all screens
 * Handles header icons positioning and content area
 */

interface ScreenLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ 
    children, 
    showHeader = true 
}) => {
    return (
        <YStack flex={1} backgroundColor="$background">
            {/* Header Icons - Fixed at top */}
            {showHeader && <HeaderIcons />}
            
            {/* Content Area - With safe area */}
            <SafeAreaView 
                style={{ flex: 1 }} 
                edges={['top']}
            >
                <YStack flex={1} paddingTop={showHeader ? "$8" : 0}>
                    {children}
                </YStack>
            </SafeAreaView>
        </YStack>
    );
};
