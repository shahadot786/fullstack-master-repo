import React, { useState } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ServiceCard } from '@/components/dashboard/ServiceCard';
import { useStats } from '@/hooks/useStats';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common/Button';

export default function DashboardScreen() {
    const router = useRouter();
    const { isDark } = useTheme();
    const user = useAuthStore((state) => state.user);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data: stats, isLoading, error, refetch, isError, isRefetching } = useStats();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    const textColor = isDark ? '#fafafa' : '#171717';
    const secondaryTextColor = isDark ? '#a3a3a3' : '#737373';
    
    console.log('Stats Debug:', { 
        stats, 
        isLoading, 
        isError, 
        error: error ? JSON.stringify(error) : null,
        isRefetching,
        user 
    });

    // Show error state
    if (isError) {
        return (
            <ScreenLayout>
                <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
                    <Ionicons name="warning" size={64} color="#ef4444" />
                    <Text color={textColor} fontSize="$6" fontWeight="600" marginTop="$4" textAlign="center">
                        Failed to Load Stats
                    </Text>
                    <Text color={secondaryTextColor} fontSize="$4" marginTop="$2" textAlign="center">
                        {(error as any)?.message || 'Unable to connect to server. Please check your connection.'}
                    </Text>
                    <YStack marginTop="$4">
                        <Button 
                            title="Try Again"
                            onPress={() => refetch()} 
                        />
                    </YStack>
                </YStack>
            </ScreenLayout>
        );
    }

    if (isLoading) {
        return (
            <ScreenLayout>
                <YStack flex={1} alignItems="center" justifyContent="center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text color={textColor} marginTop="$4">
                        Loading dashboard...
                    </Text>
                </YStack>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#3b82f6"
                    />
                }
            >
                <YStack padding="$4" gap="$4">
                    {/* Welcome Header */}
                    <YStack gap="$2">
                        <Text color={textColor} fontSize="$8" fontWeight="700">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </Text>
                        <Text color={secondaryTextColor} fontSize="$4">
                            Here's an overview of your services
                        </Text>
                    </YStack>

                    {/* Quick Stats Grid */}
                    <YStack gap="$3">
                        <Text color={textColor} fontSize="$5" fontWeight="600">
                            Quick Overview
                        </Text>
                        <XStack gap="$3">
                            <YStack flex={1}>
                                <StatCard
                                    title="Total Todos"
                                    value={stats?.todos.total || 0}
                                    icon="checkbox"
                                    gradientColors={['#3b82f6', '#2563eb']}
                                    onPress={() => router.push('/(main)/(todos)/(tabs)' as any)}
                                />
                            </YStack>
                            <YStack flex={1}>
                                <StatCard
                                    title="Active Tasks"
                                    value={stats?.todos.active || 0}
                                    icon="time"
                                    gradientColors={['#f59e0b', '#d97706']}
                                    onPress={() => router.push('/(main)/(todos)/(tabs)/active' as any)}
                                />
                            </YStack>
                        </XStack>
                        <XStack gap="$3">
                            <YStack flex={1}>
                                <StatCard
                                    title="Completed"
                                    value={stats?.todos.completed || 0}
                                    icon="checkmark-circle"
                                    gradientColors={['#10b981', '#059669']}
                                    onPress={() => router.push('/(main)/(todos)/(tabs)/completed' as any)}
                                />
                            </YStack>
                            <YStack flex={1}>
                                <StatCard
                                    title="High Priority"
                                    value={stats?.todos.highPriority || 0}
                                    icon="alert-circle"
                                    gradientColors={['#ef4444', '#dc2626']}
                                />
                            </YStack>
                        </XStack>
                    </YStack>

                    {/* All Services */}
                    <YStack gap="$3" marginTop="$2">
                        <Text color={textColor} fontSize="$5" fontWeight="600">
                            All Services
                        </Text>

                        {/* Todos */}
                        <ServiceCard
                            title="Todos"
                            icon="checkbox"
                            iconColor="#3b82f6"
                            route="/(main)/(todos)/(tabs)"
                            stats={[
                                { label: 'Total', value: stats?.todos.total || 0 },
                                { label: 'Active', value: stats?.todos.active || 0 },
                                { label: 'Completed', value: stats?.todos.completed || 0 },
                            ]}
                        />

                        {/* Notes */}
                        <ServiceCard
                            title="Notes"
                            icon="document-text"
                            iconColor="#f59e0b"
                            route="/(main)/notes"
                            stats={[
                                { label: 'Total', value: stats?.notes.total || 0 },
                                { label: 'Categories', value: stats?.notes.categories || 0 },
                            ]}
                        />

                        {/* Chat */}
                        <ServiceCard
                            title="Chat"
                            icon="chatbubbles"
                            iconColor="#8b5cf6"
                            route="/(main)/chat"
                            stats={[
                                { label: 'Conversations', value: stats?.chat.totalConversations || 0 },
                                { label: 'Unread', value: stats?.chat.unreadMessages || 0 },
                            ]}
                        />

                        {/* AI Assistant */}
                        <ServiceCard
                            title="AI Assistant"
                            icon="sparkles"
                            iconColor="#ec4899"
                            route="/(main)/ai"
                            stats={[
                                { label: 'Queries', value: stats?.ai.totalQueries || 0 },
                                { label: 'Tokens', value: stats?.ai.tokensUsed || 0 },
                            ]}
                        />

                        {/* Shop */}
                        <ServiceCard
                            title="Shop"
                            icon="storefront"
                            iconColor="#10b981"
                            route="/(main)/shop"
                            stats={[
                                { label: 'Products', value: stats?.shop.totalProducts || 0 },
                                { label: 'Orders', value: stats?.shop.totalOrders || 0 },
                            ]}
                        />

                        {/* Social */}
                        <ServiceCard
                            title="Social"
                            icon="people"
                            iconColor="#06b6d4"
                            route="/(main)/social"
                            stats={[
                                { label: 'Posts', value: stats?.social.totalPosts || 0 },
                                { label: 'Followers', value: stats?.social.followers || 0 },
                            ]}
                        />

                        {/* Delivery */}
                        <ServiceCard
                            title="Delivery"
                            icon="bicycle"
                            iconColor="#f97316"
                            route="/(main)/delivery"
                            stats={[
                                { label: 'Active', value: stats?.delivery.activeDeliveries || 0 },
                                { label: 'Completed', value: stats?.delivery.completedDeliveries || 0 },
                            ]}
                        />

                        {/* Expense Tracker */}
                        <ServiceCard
                            title="Expense Tracker"
                            icon="wallet"
                            iconColor="#84cc16"
                            route="/(main)/expense"
                            stats={[
                                { label: 'Total', value: `$${stats?.expense.totalExpenses || 0}` },
                                { label: 'This Month', value: `$${stats?.expense.thisMonth || 0}` },
                            ]}
                        />

                        {/* Weather */}
                        <ServiceCard
                            title="Weather"
                            icon="partly-sunny"
                            iconColor="#0ea5e9"
                            route="/(main)/weather"
                            stats={[
                                { label: 'Location', value: stats?.weather.currentLocation || 'Not set' },
                                { label: 'Saved', value: stats?.weather.savedLocations || 0 },
                            ]}
                        />

                        {/* URL Shortener */}
                        <ServiceCard
                            title="URL Shortener"
                            icon="link"
                            iconColor="#6366f1"
                            route="/(main)/urlshort"
                            stats={[
                                { label: 'URLs', value: stats?.urlShortener.totalUrls || 0 },
                                { label: 'Clicks', value: stats?.urlShortener.totalClicks || 0 },
                            ]}
                        />
                    </YStack>

                    {/* Bottom Padding */}
                    <YStack height={20} />
                </YStack>
            </ScrollView>
        </ScreenLayout>
    );
}
