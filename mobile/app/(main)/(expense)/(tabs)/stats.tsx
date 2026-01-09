import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useExpenseStats } from '@/hooks/useExpense';
import { useTheme } from '@/hooks/useTheme';
import { ExpenseCategory } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  Food: 'fast-food',
  Transport: 'car',
  Shopping: 'cart',
  Bills: 'flash',
  Entertainment: 'game-controller',
  Health: 'heart',
  Education: 'school',
  Other: 'ellipsis-horizontal',
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#eab308',
  Entertainment: '#8b5cf6',
  Health: '#ef4444',
  Education: '#22c55e',
  Other: '#6b7280',
};

export default function ExpenseStatsScreen() {
  const { isDark } = useTheme();
  const currentDate = new Date();
  const { data: statsData, isLoading } = useExpenseStats(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const stats = statsData?.data;

  if (isLoading) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="#3b82f6" />
        </YStack>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          {/* Header */}
          <YStack>
            <Text fontSize="$7" fontWeight="bold" color="$color">Statistics</Text>
            <Text fontSize="$3" color="$gray10">Monthly spending overview</Text>
          </YStack>

          {/* Summary Cards */}
          <XStack gap="$3">
            <Card flex={1} padding="$4" backgroundColor="#3b82f6" borderRadius="$4">
              <Ionicons name="wallet" size={24} color="white" />
              <Text color="white" opacity={0.8} fontSize="$2" marginTop="$2">Total Spent</Text>
              <Text color="white" fontSize="$7" fontWeight="bold">
                ৳{stats?.total?.toLocaleString() || 0}
              </Text>
            </Card>
            <Card flex={1} padding="$4" backgroundColor="#22c55e" borderRadius="$4">
              <Ionicons name="receipt" size={24} color="white" />
              <Text color="white" opacity={0.8} fontSize="$2" marginTop="$2">Transactions</Text>
              <Text color="white" fontSize="$7" fontWeight="bold">
                {stats?.count || 0}
              </Text>
            </Card>
          </XStack>

          {/* Category Breakdown */}
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">By Category</Text>
            {stats?.byCategory && stats.byCategory.length > 0 ? (
              stats.byCategory.map((cat) => (
                <Card
                  key={cat.category}
                  bordered
                  padding="$3"
                  backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                  borderRadius="$3"
                >
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap="$3">
                      <YStack
                        width={40}
                        height={40}
                        borderRadius={20}
                        backgroundColor={CATEGORY_COLORS[cat.category as ExpenseCategory] || '#6b7280'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Ionicons
                          name={CATEGORY_ICONS[cat.category as ExpenseCategory] as any || 'ellipsis-horizontal'}
                          size={20}
                          color="white"
                        />
                      </YStack>
                      <YStack>
                        <Text fontWeight="600" color="$color">{cat.category}</Text>
                        <Text fontSize="$2" color="$gray10">{cat.count} transactions</Text>
                      </YStack>
                    </XStack>
                    <Text fontWeight="bold" fontSize="$5" color="$color">
                      ৳{cat.total.toLocaleString()}
                    </Text>
                  </XStack>
                </Card>
              ))
            ) : (
              <Card padding="$6" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'} borderRadius="$3" alignItems="center">
                <Ionicons name="pie-chart-outline" size={48} color={isDark ? '#444' : '#ccc'} />
                <Text marginTop="$2" color="$gray10">No category data yet</Text>
              </Card>
            )}
          </YStack>

          {/* Payment Method Breakdown */}
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">By Payment Method</Text>
            {stats?.byPaymentMethod && stats.byPaymentMethod.length > 0 ? (
              <XStack flexWrap="wrap" gap="$2">
                {stats.byPaymentMethod.map((method) => (
                  <Card
                    key={method.method}
                    flex={1}
                    minWidth={150}
                    padding="$3"
                    backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                    borderRadius="$3"
                  >
                    <Text fontSize="$2" color="$gray10">{method.method}</Text>
                    <Text fontWeight="bold" fontSize="$5" color="$color" marginTop="$1">
                      ৳{method.total.toLocaleString()}
                    </Text>
                    <Text fontSize="$1" color="$gray9">{method.count} txns</Text>
                  </Card>
                ))}
              </XStack>
            ) : (
              <Card padding="$4" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'} borderRadius="$3" alignItems="center">
                <Text color="$gray10">No payment data yet</Text>
              </Card>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}
