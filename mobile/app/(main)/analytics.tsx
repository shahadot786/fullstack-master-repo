import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, XStack, Text, Card, Spinner, Avatar } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/api';
import type { AnalyticsUser, AnalyticsService } from '@repo/shared';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';

export default function AnalyticsScreen() {
  const { isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<AnalyticsUser[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['analytics', currentPage],
    queryFn: () => getAnalytics(currentPage, 6),
  });

  // Update users list when data changes
  React.useEffect(() => {
    if (data?.data) {
      if (currentPage === 1) {
        setAllUsers(data.data.users);
      } else {
        setAllUsers((prev) => [...prev, ...data.data.users]);
      }
      setHasMore(currentPage < data.data.pagination.totalPages);
    }
  }, [data, currentPage]);

  const analytics = data?.data;
  const currentUser = allUsers.find((u: AnalyticsUser) => u.id === user?._id);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setAllUsers([]);
    setHasMore(true);
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && !isRefetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore, isRefetching]);

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" color="$blue10" />
      </YStack>
    );
  };

  if (isLoading && currentPage === 1) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$blue10" />
        </YStack>
      </ScreenLayout>
    );
  }

  if (error && currentPage === 1) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
          <Ionicons name="alert-circle" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text fontSize="$6" fontWeight="bold" color="$red10" marginTop="$4">
            Error Loading Analytics
          </Text>
          <Text fontSize="$4" color="$gray10" marginTop="$2" textAlign="center">
            Please try again later
          </Text>
        </YStack>
      </ScreenLayout>
    );
  }

  const renderHeader = () => (
    <YStack padding="$4" gap="$4">
      {/* Header */}
      <YStack gap="$2">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          📊 Global Analytics
        </Text>
        <Text fontSize="$4" color="$gray10">
          Real-time insights into platform activity
        </Text>
      </YStack>

      {/* Your Activity Highlight */}
      {currentUser && (
        <Card
          elevate
          backgroundColor="$blue9"
          padding="$4"
          borderRadius="$4"
        >
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="bar-chart" size={24} color="white" />
              <Text fontSize="$6" fontWeight="bold" color="white">
                Your Activity
              </Text>
            </XStack>
            {currentUser.services.map((service: AnalyticsService) => (
              <YStack
                key={service.name}
                backgroundColor="rgba(255,255,255,0.15)"
                padding="$3"
                borderRadius="$3"
                gap="$2"
              >
                <Text fontSize="$5" fontWeight="600" color="white">
                  {service.name}
                </Text>
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="white">Total: {service.total}</Text>
                  <Text fontSize="$3" color="white">Completed: {service.completed}</Text>
                  <Text fontSize="$3" color="white">Pending: {service.pending}</Text>
                </XStack>
              </YStack>
            ))}
          </YStack>
        </Card>
      )}

      {/* Global Service Statistics */}
      <YStack gap="$3">
        <XStack alignItems="center" gap="$2">
          <Ionicons name="stats-chart" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
          <Text fontSize="$6" fontWeight="bold" color="$color">
            Service Statistics
          </Text>
        </XStack>
        {analytics?.services.map((service: AnalyticsService) => (
          <Card
            key={service.name}
            elevate
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
          >
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$color">
                {service.name}
              </Text>
              <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray10">Total</Text>
                  <Text fontSize="$7" fontWeight="bold" color="$blue10">
                    {service.total}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray10">Completed</Text>
                  <Text fontSize="$5" fontWeight="600" color="$green10">
                    {service.completed}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray10">Pending</Text>
                  <Text fontSize="$5" fontWeight="600" color="$orange10">
                    {service.pending}
                  </Text>
                </XStack>
              </YStack>
              {service.total > 0 && (
                <YStack gap="$2" marginTop="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$borderColor">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$gray10">Completion Rate</Text>
                    <Text fontSize="$3" fontWeight="600" color="$blue10">
                      {Math.round((service.completed / service.total) * 100)}%
                    </Text>
                  </XStack>
                </YStack>
              )}
            </YStack>
          </Card>
        ))}
      </YStack>

      {/* User Activity Header */}
      <XStack alignItems="center" gap="$2" marginTop="$2">
        <Ionicons name="people" size={24} color={isDark ? '#a78bfa' : '#8b5cf6'} />
        <Text fontSize="$6" fontWeight="bold" color="$color">
          User Activity
        </Text>
      </XStack>
    </YStack>
  );

  const renderUserCard = ({ item: analyticsUser }: { item: AnalyticsUser }) => (
    <Card
      elevate
      backgroundColor="$background"
      padding="$4"
      marginHorizontal="$4"
      marginBottom="$3"
      borderRadius="$4"
      borderWidth={analyticsUser.id === user?._id ? 2 : 0}
      borderColor={analyticsUser.id === user?._id ? '$blue10' : 'transparent'}
    >
      <YStack gap="$3">
        {/* User Header */}
        <XStack alignItems="center" gap="$3">
          {analyticsUser.imageUrl ? (
            <Avatar circular size="$5">
              <Avatar.Image src={analyticsUser.imageUrl} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
          ) : (
            <YStack
              width={56}
              height={56}
              borderRadius={28}
              backgroundColor="$blue10"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="$7" fontWeight="bold" color="white">
                {analyticsUser.name.charAt(0).toUpperCase()}
              </Text>
            </YStack>
          )}
          <YStack flex={1}>
            <XStack alignItems="center" gap="$2">
              <Text fontSize="$5" fontWeight="bold" color="$color">
                {analyticsUser.name}
              </Text>
              {analyticsUser.id === user?._id && (
                <YStack
                  backgroundColor="$blue4"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="$blue10" fontWeight="600">
                    You
                  </Text>
                </YStack>
              )}
            </XStack>
            <Text fontSize="$3" color="$gray10">
              Joined {new Date(analyticsUser.createdAt).toLocaleDateString()}
            </Text>
          </YStack>
        </XStack>

        {/* User Services */}
        {analyticsUser.services.map((service: AnalyticsService) => (
          <YStack
            key={service.name}
            backgroundColor={isDark ? '$gray3' : '$gray2'}
            padding="$3"
            borderRadius="$3"
            gap="$2"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color">
                {service.name}
              </Text>
              <Ionicons name="trending-up" size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
            </XStack>
            <XStack justifyContent="space-around">
              <YStack alignItems="center">
                <Text fontSize="$2" color="$gray10">Total</Text>
                <Text fontSize="$4" fontWeight="600" color="$color">
                  {service.total}
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$2" color="$gray10">Done</Text>
                <Text fontSize="$4" fontWeight="600" color="$green10">
                  {service.completed}
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$2" color="$gray10">Pending</Text>
                <Text fontSize="$4" fontWeight="600" color="$orange10">
                  {service.pending}
                </Text>
              </YStack>
            </XStack>
          </YStack>
        ))}
      </YStack>
    </Card>
  );

  return (
    <ScreenLayout>
      <FlatList
        data={allUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching && currentPage === 1} onRefresh={handleRefresh} />
        }
      />
    </ScreenLayout>
  );
}
