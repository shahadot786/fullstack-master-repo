import React from 'react';
import { FlatList, Alert, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Card, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useExpenses, useDeleteExpense, useCategories } from '@/hooks/useExpense';
import { useTheme } from '@/hooks/useTheme';
import { format } from 'date-fns';
import { Expense, ExpenseCategoryResponse } from '@/types';

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

// Generate gradient colors based on category string
const GRADIENT_COLORS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#ff9a9e', '#fecfef'],
  ['#ffecd2', '#fcb69f'],
];

const getGradientForCategory = (category: string): string => {
  const index = category.charCodeAt(0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index][0];
};

const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || getGradientForCategory(category);
};

const getCategoryIcon = (category: string): string | null => {
  return CATEGORY_ICONS[category] || null;
};

export default function ExpensesListScreen() {
  const { isDark } = useTheme();
  const { data: expensesData, isLoading, refetch } = useExpenses();
  const { data: categoriesData } = useCategories();
  const deleteMutation = useDeleteExpense();

  const handleAllCategories = categoriesData?.data || [];

  const handleDelete = (id: string) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(id);
          } catch {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const categoryObj = (handleAllCategories as ExpenseCategoryResponse[]).find(c => c.name === item.category);
    const customEmoji = categoryObj?.emoji;
    const defaultIcon = getCategoryIcon(item.category);
    const color = categoryObj?.color || getCategoryColor(item.category);
    const initial = item.category.charAt(0).toUpperCase();

    return (
      <Card
        bordered
        padding="$3"
        marginBottom="$2"
        marginHorizontal="$4"
        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
        borderRadius="$4"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3" flex={1}>
            <YStack
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor={color}
              alignItems="center"
              justifyContent="center"
            >
              {customEmoji ? (
                <Text fontSize={20}>{customEmoji}</Text>
              ) : defaultIcon ? (
                <Ionicons
                  name={defaultIcon as any}
                  size={22}
                  color="white"
                />
              ) : (
                <Text color="white" fontSize="$5" fontWeight="bold">{initial}</Text>
              )}
            </YStack>
            <YStack flex={1}>
              <Text fontWeight="600" fontSize="$4" color="$color">{item.category}</Text>
              <Text fontSize="$2" color="$gray10" numberOfLines={1}>
                {item.description || format(new Date(item.date), 'MMM d, yyyy')}
              </Text>
              <XStack marginTop="$1">
                <Text fontSize="$1" color="$gray9" backgroundColor={isDark ? '#333' : '#f3f4f6'} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                  {item.paymentMethod}
                </Text>
              </XStack>
            </YStack>
          </XStack>
          <XStack alignItems="center" gap="$3">
            <Text fontWeight="bold" fontSize="$5" color="$color">৳{item.amount.toLocaleString()}</Text>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </XStack>
        </XStack>
      </Card>
    );
  };

  return (
    <ScreenLayout>
      <YStack flex={1}>
        {/* Header */}
        <YStack padding="$4" paddingBottom="$2">
          <Text fontSize="$7" fontWeight="bold" color="$color">All Expenses</Text>
          <Text fontSize="$3" color="$gray10">Your complete expense history</Text>
        </YStack>

        {/* Expense List */}
        {isLoading ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Spinner size="large" color="#3b82f6" />
          </YStack>
        ) : (
          <FlatList
            data={expensesData?.data}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <YStack padding="$8" alignItems="center" opacity={0.5}>
                <Ionicons name="wallet-outline" size={56} color={isDark ? '#fff' : '#000'} />
                <Text marginTop="$3" fontSize="$4" fontWeight="500" textAlign="center">No expenses yet</Text>
                <Text fontSize="$2" color="$gray10" textAlign="center">Tap the Add tab to record your first expense</Text>
              </YStack>
            }
            onRefresh={refetch}
            refreshing={isLoading}
          />
        )}
      </YStack>
    </ScreenLayout>
  );
}
