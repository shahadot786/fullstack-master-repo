import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { XStack, YStack, Text, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useShoutboxMessages, useSendShoutboxMessage } from '@/hooks/useShoutbox';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { ShoutboxMessage } from '@/types';
import { ShoutboxBubble } from '@/components/chat/ShoutboxBubble';
import EmojiPicker, { emojiData } from '@hiraku-ai/react-native-emoji-picker';

export default function ShoutboxScreen() {
  const { isDark } = useTheme();
  const [shoutContent, setShoutContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuthStore();
  const currentUserId = user?._id;

  const {
    data: shoutboxData,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShoutboxMessages();

  const sendShoutboxMessageMutation = useSendShoutboxMessage();

  const shoutboxMessages = useMemo(() => {
    if (!shoutboxData?.pages) return [];
    const all = shoutboxData.pages.flatMap((page) => page.data);
    return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [shoutboxData]);

  const handleSendShout = async () => {
    if (!shoutContent.trim() || sendShoutboxMessageMutation.isPending) return;

    try {
      await sendShoutboxMessageMutation.mutateAsync(shoutContent.trim());
      setShoutContent('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to send shout:', error);
    }
  };

  const renderItem = useCallback(({ item }: { item: ShoutboxMessage }) => {
    const isOwn = (typeof item.senderId === 'string' && item.senderId === currentUserId) ||
      (typeof item.senderId === 'object' && item.senderId._id === currentUserId);

    return <ShoutboxBubble message={item} isOwn={isOwn} />;
  }, [currentUserId]);

  const renderEmpty = () => (
    <YStack flex={1} alignItems="center" justifyContent="center" paddingTop="$10" paddingHorizontal="$6">
      <YStack backgroundColor={isDark ? '#1a1a1a' : '#f8fafc'} padding="$6" borderRadius="$6" marginBottom="$4">
        <Ionicons name="megaphone-outline" size={48} color={isDark ? '#404040' : '#cbd5e1'} />
      </YStack>
      <Text fontSize="$5" fontWeight="600" color={isDark ? '#fafafa' : '#1e293b'} marginBottom="$2">
        Shoutbox is Empty
      </Text>
      <Text fontSize="$3" color={isDark ? '#737373' : '#64748b'} textAlign="center">
        Be the first one to say something to everyone!
      </Text>
    </YStack>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" color="#3b82f6" />
      </YStack>
    );
  };

  if (isLoading && shoutboxMessages.length === 0) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor={isDark ? '#000000' : '#ffffff'}>
          <Spinner size="large" color="#3b82f6" />
          <Text marginTop="$4" color={isDark ? '#737373' : '#64748b'}>Entering Shoutbox...</Text>
        </YStack>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <YStack flex={1} backgroundColor={isDark ? '#000000' : '#ffffff'}>
        {/* Header */}
        <XStack
          padding="$4"
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={0.5}
          borderBottomColor={isDark ? '#262626' : '#f3f4f6'}
        >
          <YStack>
            <Text fontSize="$6" fontWeight="bold" color={isDark ? '#fafafa' : '#111827'}>
              Shoutbox
            </Text>
            <Text fontSize="$2" color="#10b981" fontWeight="600">
              &bull; Public Room
            </Text>
          </YStack>
        </XStack>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            data={shoutboxMessages}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            inverted
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#3b82f6"
              />
            }
            contentContainerStyle={{ paddingVertical: 10 }}
          />

          {/* Input */}
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$3"
            backgroundColor={isDark ? '#000000' : '#ffffff'}
            borderTopWidth={0.5}
            borderTopColor={isDark ? '#262626' : '#f3f4f6'}
            alignItems="flex-end"
            gap="$1"
          >
            {/* Emoji trigger */}
            <Pressable
              onPress={() => setShowEmojiPicker(true)}
              style={({ pressed }) => ({
                padding: 10,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Ionicons name="happy-outline" size={26} color={isDark ? '#737373' : '#94a3b8'} />
            </Pressable>

            <YStack
              flex={1}
              backgroundColor={isDark ? '#1a1a1a' : '#f3f4f6'}
              borderRadius="$5"
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderWidth={0.5}
              borderColor={isDark ? '#262626' : '#e5e7eb'}
            >
              <TextInput
                placeholder="Shout something..."
                placeholderTextColor={isDark ? '#525252' : '#9ca3af'}
                value={shoutContent}
                onChangeText={setShoutContent}
                multiline
                style={{
                  fontSize: 16,
                  color: isDark ? '#fafafa' : '#111827',
                  maxHeight: 120,
                  lineHeight: 20,
                  paddingTop: Platform.OS === 'ios' ? 8 : 4,
                  paddingBottom: Platform.OS === 'ios' ? 8 : 4,
                }}
              />
            </YStack>
            <Pressable
              onPress={handleSendShout}
              disabled={!shoutContent.trim() || sendShoutboxMessageMutation.isPending}
              style={({ pressed }) => ({
                backgroundColor: shoutContent.trim() ? '#3b82f6' : (isDark ? '#1a1a1a' : '#e5e7eb'),
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              {sendShoutboxMessageMutation.isPending ? (
                <Spinner size="small" color="white" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={shoutContent.trim() ? 'white' : (isDark ? '#404040' : '#9ca3af')}
                />
              )}
            </Pressable>
          </XStack>

          <EmojiPicker
            visible={showEmojiPicker}
            emojis={emojiData}
            onEmojiSelect={(emoji: string) => {
              setShoutContent((prev) => prev + emoji);
              setShowEmojiPicker(false);
            }}
            onClose={() => setShowEmojiPicker(false)}
          />
        </KeyboardAvoidingView>
      </YStack>
    </ScreenLayout>
  );
}
