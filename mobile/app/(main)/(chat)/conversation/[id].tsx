import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { XStack, YStack, Text, Avatar, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { useConversation, useMessages, useSendMessage, useMarkAsRead } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { Message, SendMessageDto, ChatUser } from '@/types';

export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuthStore();
  const currentUserId = user?._id;

  const { data: conversation, isLoading: isLoadingConversation } = useConversation(id);
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(id);

  const sendMessageMutation = useSendMessage(id);
  const markAsReadMutation = useMarkAsRead();

  // Flatten and sort messages from infinite query (newest first for inverted list)
  const messages: Message[] = useMemo(() => {
    if (!messagesData?.pages) return [];
    const all = messagesData.pages.flatMap((page) => page.data);
    return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messagesData]);

  // Mark as read when entering the conversation
  useEffect(() => {
    if (id) {
      markAsReadMutation.mutate(id);
    }
  }, [id]);

  const getOtherParticipant = (): ChatUser | null => {
    if (!conversation) return null;
    if (conversation.type === 'direct') {
      return conversation.participants.find((p) => p._id !== currentUserId) || null;
    }
    return null;
  };

  const getConversationName = (): string => {
    if (!conversation) return 'Chat';
    if (conversation.type === 'group' && conversation.name) {
      return conversation.name;
    }
    const other = getOtherParticipant();
    return other?.name || 'Unknown';
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSendMessage = async (message: SendMessageDto) => {
    await sendMessageMutation.mutateAsync(message);
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const isOwnMessage = (message: Message): boolean => {
    const sender = typeof message.senderId === 'object' ? message.senderId : null;
    return sender?._id === currentUserId || message.senderId === currentUserId;
  };

  const shouldShowAvatar = (message: Message, index: number): boolean => {
    if (isOwnMessage(message)) return false;
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    const currentSender = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
    const nextSender = typeof nextMessage.senderId === 'object' ? nextMessage.senderId._id : nextMessage.senderId;
    return currentSender !== nextSender;
  };

  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => (
      <ChatBubble
        message={item}
        isOwn={isOwnMessage(item)}
        showAvatar={shouldShowAvatar(item, index)}
        onImagePress={(imageUrl) => {
          // Could open image in full screen viewer
          console.log('Open image:', imageUrl);
        }}
      />
    ),
    [currentUserId, messages]
  );

  const renderHeader = () => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" color="$blue9" />
      </YStack>
    );
  };

  const renderEmpty = () => (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      style={{ transform: [{ scaleY: -1 }] }}
    >
      <Ionicons name="chatbubble-outline" size={48} color="#9ca3af" />
      <Text fontSize="$4" color="$gray11" marginTop="$4" textAlign="center">
        No messages yet. Start the conversation!
      </Text>
    </YStack>
  );

  const { isDark } = useTheme();
  const textColor = isDark ? '#fafafa' : '#111827';
  const secondaryTextColor = isDark ? '#a3a3a3' : '#6b7280';
  const borderColor = isDark ? '#262626' : '#f3f4f6';

  const conversationName = getConversationName();
  const other = getOtherParticipant();

  if (isLoadingConversation || isLoadingMessages) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$blue9" />
          <Text marginTop="$4" color="$gray11">
            Loading conversation...
          </Text>
        </YStack>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <YStack flex={1} backgroundColor={isDark ? '#000000' : '#ffffff'}>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        >
          {/* Header */}
          <XStack
            paddingVertical="$2"
            paddingHorizontal="$3"
            gap="$2"
            alignItems="center"
            borderBottomWidth={0.5}
            borderBottomColor={borderColor}
            backgroundColor={isDark ? '#000000' : '#ffffff'}
          >
            {/* Back button */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                padding: 8,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Ionicons name="chevron-back" size={28} color="#3b82f6" />
            </Pressable>

            {/* Avatar */}
            <Avatar circular size="$3.5">
              {other?.profileImage ? (
                <Avatar.Image src={other.profileImage} />
              ) : (
                <Avatar.Fallback
                  backgroundColor="#3b82f6"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontSize={12} fontWeight="700">
                    {getInitials(conversationName)}
                  </Text>
                </Avatar.Fallback>
              )}
            </Avatar>

            {/* Name and status */}
            <YStack flex={1} marginLeft="$1">
              <Text fontSize="$4" fontWeight="700" color={textColor} numberOfLines={1}>
                {conversationName}
              </Text>
              {conversation?.type === 'group' ? (
                <Text fontSize={11} color={secondaryTextColor}>
                  {conversation.participants.length} members
                </Text>
              ) : (
                <XStack alignItems="center" gap="$1">
                  <YStack width={6} height={6} borderRadius={3} backgroundColor="#10b981" />
                  <Text fontSize={11} color={secondaryTextColor} fontWeight="500">
                    Online
                  </Text>
                </XStack>
              )}
            </YStack>

            {/* Actions */}
            <XStack gap="$1">
              <Pressable
                onPress={() => router.push({
                  pathname: '/(main)/(chat)/conversation/settings',
                  params: { id: id }
                })}
                style={({ pressed }) => ({
                  padding: 8,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Ionicons name="settings-outline" size={22} color="#3b82f6" />
              </Pressable>
            </XStack>
          </XStack>

          {/* Messages list */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            inverted
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: 12,
            }}
            showsVerticalScrollIndicator={false}
          />

          {/* Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={sendMessageMutation.isPending}
            placeholder="Message..."
          />
        </KeyboardAvoidingView>
      </YStack>
    </ScreenLayout>
  );
}
