import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { YStack } from 'tamagui';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function WebViewScreen() {
    const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
    const { isDark } = useTheme();

    return (
        <YStack flex={1} backgroundColor="$background">
            <WebView
                source={{ uri: url }}
                startInLoadingState={true}
                renderLoading={() => (
                    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
                        <ActivityIndicator size="large" color="#3b82f6" />
                    </YStack>
                )}
                style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }}
            />
        </YStack>
    );
}
