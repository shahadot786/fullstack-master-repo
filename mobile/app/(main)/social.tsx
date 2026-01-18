import React, { useState, useCallback, useRef } from 'react';
import { YStack, XStack, Text, Spinner } from 'tamagui';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { RefreshControl, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/ScreenLayout';

const SOCIAL_URL = 'https://threads-clone-three-nu.vercel.app/';

export default function SocialScreen() {
    const { isDark } = useTheme();
    const webViewRef = useRef<WebView>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [key, setKey] = useState(0);

    const handleLoadStart = useCallback(() => {
        setIsLoading(true);
        setHasError(false);
    }, []);

    const handleLoadEnd = useCallback(() => {
        setIsLoading(false);
        setIsRefreshing(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
        setIsRefreshing(false);
    }, []);

    const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setHasError(false);
        setKey(prev => prev + 1);
    }, []);

    const handleRetry = useCallback(() => {
        setHasError(false);
        setIsLoading(true);
        setKey(prev => prev + 1);
    }, []);

    const handleGoBack = useCallback(() => {
        webViewRef.current?.goBack();
    }, []);

    const handleGoForward = useCallback(() => {
        webViewRef.current?.goForward();
    }, []);

    const handleReload = useCallback(() => {
        webViewRef.current?.reload();
    }, []);

    const backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1a1a1a';
    const subtextColor = isDark ? '#a1a1aa' : '#71717a';
    const borderColor = isDark ? '#27272a' : '#e4e4e7';
    const toolbarBg = isDark ? '#18181b' : '#fafafa';

    // Error State
    if (hasError) {
        return (
            <ScreenLayout>
                <YStack flex={1} alignItems="center" justifyContent="center" paddingHorizontal="$6" gap="$4">
                    <YStack
                        width={80}
                        height={80}
                        borderRadius={40}
                        backgroundColor={isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={40}
                            color="#ef4444"
                        />
                    </YStack>
                    <Text color={textColor} fontSize={22} fontWeight="700" textAlign="center">
                        Failed to Load
                    </Text>
                    <Text color={subtextColor} fontSize={15} textAlign="center" lineHeight={22}>
                        Something went wrong while loading the social feed. Please check your internet connection and try again.
                    </Text>
                    <TouchableOpacity
                        onPress={handleRetry}
                        style={{
                            backgroundColor: '#3b82f6',
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 12,
                            marginTop: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <Ionicons name="refresh" size={18} color="white" />
                        <Text color="white" fontWeight="600">Try Again</Text>
                    </TouchableOpacity>
                </YStack>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            <YStack flex={1} backgroundColor={backgroundColor}>
                {/* Navigation Toolbar */}
                <XStack
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    backgroundColor={toolbarBg}
                    borderBottomWidth={1}
                    borderBottomColor={borderColor}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <XStack gap="$2" alignItems="center">
                        <TouchableOpacity
                            onPress={handleGoBack}
                            disabled={!canGoBack}
                            style={{ opacity: canGoBack ? 1 : 0.4, padding: 8 }}
                        >
                            <Ionicons name="chevron-back" size={24} color={textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleGoForward}
                            disabled={!canGoForward}
                            style={{ opacity: canGoForward ? 1 : 0.4, padding: 8 }}
                        >
                            <Ionicons name="chevron-forward" size={24} color={textColor} />
                        </TouchableOpacity>
                    </XStack>

                    <Text color={textColor} fontSize={16} fontWeight="600">
                        Social Feed
                    </Text>

                    <TouchableOpacity onPress={handleReload} style={{ padding: 8 }}>
                        <Ionicons name="refresh" size={22} color={textColor} />
                    </TouchableOpacity>
                </XStack>

                {/* WebView with Pull to Refresh */}
                <YStack flex={1} position="relative">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <YStack
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            backgroundColor={isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.9)'}
                            alignItems="center"
                            justifyContent="center"
                            zIndex={10}
                        >
                            <Spinner size="large" color="#3b82f6" />
                            <Text color={subtextColor} fontSize={14} marginTop="$3">
                                Loading Social Feed...
                            </Text>
                        </YStack>
                    )}

                    {Platform.OS === 'ios' ? (
                        <ScrollView
                            contentContainerStyle={{ flex: 1 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                    tintColor="#3b82f6"
                                />
                            }
                        >
                            <WebView
                                key={key}
                                ref={webViewRef}
                                source={{ uri: SOCIAL_URL }}
                                onLoadStart={handleLoadStart}
                                onLoadEnd={handleLoadEnd}
                                onError={handleError}
                                onHttpError={handleError}
                                onNavigationStateChange={handleNavigationStateChange}
                                style={{ flex: 1, backgroundColor }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={false}
                                scalesPageToFit={true}
                                allowsInlineMediaPlayback={true}
                                mediaPlaybackRequiresUserAction={false}
                            />
                        </ScrollView>
                    ) : (
                        <WebView
                            key={key}
                            ref={webViewRef}
                            source={{ uri: SOCIAL_URL }}
                            onLoadStart={handleLoadStart}
                            onLoadEnd={handleLoadEnd}
                            onError={handleError}
                            onHttpError={handleError}
                            onNavigationStateChange={handleNavigationStateChange}
                            style={{ flex: 1, backgroundColor }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={false}
                            scalesPageToFit={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            pullToRefreshEnabled={true}
                        />
                    )}
                </YStack>
            </YStack>
        </ScreenLayout>
    );
}
