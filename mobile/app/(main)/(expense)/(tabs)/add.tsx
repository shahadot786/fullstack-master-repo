import React, { useState } from 'react';
import { ScrollView, Alert, Pressable, Modal } from 'react-native';
import { YStack, XStack, Text, Input, Button, Card, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useCreateExpense, useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useExpense';
import { useTheme } from '@/hooks/useTheme';
import { PaymentMethod, ExpenseCategoryResponse } from '@/types';
import EmojiPicker, { emojiData } from '@hiraku-ai/react-native-emoji-picker';

const DEFAULT_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'
];

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Card', 'bKash', 'Nagad', 'Upay', 'Rocket', 'Bank Transfer'];

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

const GRADIENT_COLORS = [
  '#667eea', '#f093fb', '#4facfe', '#43e97b',
  '#fa709a', '#a8edea', '#ff9a9e', '#ffecd2'
];

const getGradientForCategory = (category: string): string => {
  const index = category.charCodeAt(0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index];
};

const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || getGradientForCategory(category);
};

const getCategoryIcon = (category: string): string | null => {
  return CATEGORY_ICONS[category] || null;
};

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Food');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { isDark } = useTheme();
  const createMutation = useCreateExpense();
  const { data: categoriesData, refetch: refetchCategories } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Create default objects to match API response structure
  const defaultCategoryObjects: ExpenseCategoryResponse[] = DEFAULT_CATEGORIES.map(name => ({
    _id: name,
    name,
    userId: null,
    isDefault: true,
    createdAt: "",
    updatedAt: ""
  }));

  const CATEGORIES = categoriesData?.data || defaultCategoryObjects;

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    // Enforce icon selection for custom categories
    if (!selectedEmoji) {
      Alert.alert('Error', 'Please select an icon/emoji for the category');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        emoji: selectedEmoji || undefined
      });
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setSelectedEmoji(null);
      setShowAddModal(false);
      refetchCategories();
      Alert.alert('Success', 'Category added!');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete the "${name}" category?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategoryMutation.mutateAsync(id);
              if (category === name) {
                setCategory('Food');
              }
              refetchCategories();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const handleAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    try {
      await createMutation.mutateAsync({
        amount: parseFloat(amount),
        category,
        description: description || undefined,
        paymentMethod,
      });
      setAmount('');
      setDescription('');
      Alert.alert('Success', 'Expense added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add expense');
    }
  };

  // Helper to get display icon (either emoji or ionicon) for a category
  const renderCategoryIcon = (catObj: ExpenseCategoryResponse, isSelected: boolean) => {
    if (catObj.emoji) {
      return <Text fontSize={20}>{catObj.emoji}</Text>;
    }
    const iconName = getCategoryIcon(catObj.name);
    if (iconName) {
      return (
        <Ionicons
          name={iconName as any}
          size={24}
          color={isSelected ? 'white' : (isDark ? '#aaa' : '#666')}
        />
      );
    }
    return (
      <Text fontSize="$5" fontWeight="bold" color={isSelected ? 'white' : (isDark ? '#aaa' : '#666')}>
        {catObj.name.charAt(0).toUpperCase()}
      </Text>
    );
  };

  return (
    <ScreenLayout showHeader={false}>
      {/* Add Category Overlay (Custom Modal to avoid nesting issues on iOS) */}
      {showAddModal && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0,0,0,0.5)"
          alignItems="center"
          justifyContent="center"
          padding="$4"
          zIndex={100}
        >
          <Card padding="$5" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'} borderRadius="$4" width="100%" maxWidth={350}>
            <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$3">Add Custom Category</Text>

            <XStack gap="$2" marginBottom="$3" alignItems="center">
              <Button
                size="$4"
                width={50}
                height={50}
                backgroundColor={isDark ? '#333' : '#f0f0f0'}
                onPress={() => setShowEmojiPicker(true)}
                padding={0}
                alignItems="center"
                justifyContent="center"
                borderColor={!selectedEmoji ? '$red10' : 'transparent'}
                borderWidth={!selectedEmoji ? 1 : 0}
              >
                {selectedEmoji ? (
                  <Text fontSize={24}>{selectedEmoji}</Text>
                ) : (
                  <Ionicons name="happy-outline" size={24} color={isDark ? '#aaa' : '#666'} />
                )}
              </Button>
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                backgroundColor={isDark ? '#222' : '#f9fafb'}
                borderRadius="$3"
                height={50}
                flex={1}
              />
            </XStack>

            <XStack gap="$2">
              <Button
                flex={1}
                backgroundColor={isDark ? '#333' : '#e5e5e5'}
                onPress={() => { setShowAddModal(false); setNewCategoryName(''); setSelectedEmoji(null); }}
              >
                <Text color="$color">Cancel</Text>
              </Button>
              <Button
                flex={1}
                backgroundColor="#3b82f6"
                onPress={handleAddCategory}
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? (
                  <Spinner color="white" size="small" />
                ) : (
                  <Text color="white">Add</Text>
                )}
              </Button>
            </XStack>
          </Card>
        </YStack>
      )}

      <EmojiPicker
        visible={showEmojiPicker}
        emojis={emojiData}
        onEmojiSelect={(emoji: string) => {
          setSelectedEmoji(emoji);
          setShowEmojiPicker(false);
        }}
        onClose={() => setShowEmojiPicker(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          <YStack>
            <Text fontSize="$7" fontWeight="bold" color="$color">Add Expense</Text>
            <Text fontSize="$3" color="$gray10">Record a new expense</Text>
          </YStack>

          {/* Category Selection */}
          <Card bordered padding="$4" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'} borderRadius="$4">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Text fontSize="$3" fontWeight="600" color="$color">Select Category</Text>
              <Text fontSize="$1" color="$gray9">(Long-press to delete)</Text>
            </XStack>
            <XStack flexWrap="wrap" gap="$2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                const color = cat.color || getCategoryColor(cat.name);

                return (
                  <Pressable
                    key={cat._id}
                    onPress={() => setCategory(cat.name)}
                    onLongPress={() => !cat.isDefault && handleDeleteCategory(cat._id, cat.name)}
                  >
                    <YStack
                      alignItems="center"
                      gap="$1"
                      padding="$3"
                      borderRadius="$3"
                      backgroundColor={isSelected ? color : (isDark ? '#333' : '#f3f4f6')}
                      minWidth={80}
                      // Apply validation styles if this category was just added
                      borderWidth={isSelected ? 0 : 0}
                    >
                      {renderCategoryIcon(cat, isSelected)}
                      <Text
                        fontSize="$2"
                        fontWeight={isSelected ? '600' : '400'}
                        color={isSelected ? 'white' : (isDark ? '#aaa' : '#666')}
                      >
                        {cat.name}
                      </Text>
                    </YStack>
                  </Pressable>
                );
              })}
              {/* Add Custom Button */}
              <Pressable onPress={() => setShowAddModal(true)}>
                <YStack
                  alignItems="center"
                  gap="$1"
                  padding="$3"
                  borderRadius="$3"
                  backgroundColor={isDark ? '#333' : '#f3f4f6'}
                  minWidth={80}
                  borderWidth={1}
                  borderColor={isDark ? '#555' : '#ddd'}
                  borderStyle="dashed"
                >
                  <Ionicons name="add" size={24} color={isDark ? '#aaa' : '#666'} />
                  <Text fontSize="$2" color={isDark ? '#aaa' : '#666'}>Add</Text>
                </YStack>
              </Pressable>
            </XStack>
          </Card>

          {/* Amount & Description */}
          <Card bordered padding="$4" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'} borderRadius="$4">
            <Text fontSize="$3" fontWeight="600" color="$color" marginBottom="$3">Expense Details</Text>
            <YStack gap="$3">
              <YStack>
                <Text fontSize="$2" color="$gray10" marginBottom="$1">Amount *</Text>
                <Input
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  backgroundColor={isDark ? '#222' : '#f9fafb'}
                  borderRadius="$3"
                  height={52}
                  fontSize="$5"
                />
              </YStack>
              <YStack>
                <Text fontSize="$2" color="$gray10" marginBottom="$1">Description (optional)</Text>
                <Input
                  placeholder="What did you spend on?"
                  value={description}
                  onChangeText={setDescription}
                  backgroundColor={isDark ? '#222' : '#f9fafb'}
                  borderRadius="$3"
                  height={48}
                />
              </YStack>
            </YStack>
          </Card>

          {/* Payment Method */}
          <Card bordered padding="$4" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'} borderRadius="$4">
            <Text fontSize="$3" fontWeight="600" color="$color" marginBottom="$3">Payment Method</Text>
            <XStack flexWrap="wrap" gap="$2">
              {PAYMENT_METHODS.map((method) => (
                <Pressable key={method} onPress={() => setPaymentMethod(method)}>
                  <XStack
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    borderRadius="$3"
                    backgroundColor={paymentMethod === method ? '#3b82f6' : (isDark ? '#333' : '#f3f4f6')}
                  >
                    <Text fontSize="$3" fontWeight={paymentMethod === method ? '600' : '400'} color={paymentMethod === method ? 'white' : (isDark ? '#aaa' : '#666')}>
                      {method}
                    </Text>
                  </XStack>
                </Pressable>
              ))}
            </XStack>
          </Card>

          {/* Submit */}
          <Button
            backgroundColor="#3b82f6"
            color="white"
            height={56}
            borderRadius="$4"
            onPress={handleAdd}
            disabled={createMutation.isPending}
            pressStyle={{ backgroundColor: '#2563eb' }}
          >
            {createMutation.isPending ? (
              <Spinner color="white" />
            ) : (
              <XStack alignItems="center" gap="$2">
                <Ionicons name="add-circle" size={24} color="white" />
                <Text color="white" fontSize="$4" fontWeight="600">Add Expense</Text>
              </XStack>
            )}
          </Button>

          <YStack height={50} />
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}
