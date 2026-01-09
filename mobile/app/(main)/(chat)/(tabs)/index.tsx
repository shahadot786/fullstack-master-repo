import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, Pressable } from 'react-native';
import { XStack, YStack, Text, Avatar, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useInfiniteConversations, useUnreadCount } from '@/hooks/useChat';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Conversation, ChatUser } from '@/types';

export default function DirectMessagesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuthStore();
  const currentUserId = user?._id;

  const {
    data: conversationsData,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteConversations();

  const { data: unreadCount } = useUnreadCount();

  const conversations = useMemo(() => {
    if (!conversationsData?.pages) return [];
    const all = conversationsData.pages.flatMap((page) => page.data);
    return [...all].sort((a, b) => {
      const dateA = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [conversationsData]);

  const getOtherParticipant = (conversation: Conversation): ChatUser | null => {
    if (conversation.type === 'direct') {
      return conversation.participants.find((p) => p._id !== currentUserId) || null;
    }
    return null;
  };

  const getConversationName = (conversation: Conversation): string => {
    if (conversation.type === 'group' && conversation.name) {
      return conversation.name;
    }
    const other = getOtherParticipant(conversation);
    return other?.name || 'Unknown';
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleConversationPress = (id: string) => {
    router.push({
      pathname: '/(main)/(chat)/conversation/[id]',
      params: { id },
    });
  };

  const handleNewChat = () => {
    router.push('/(main)/(chat)/new-chat');
  };

  const renderItem = useCallback(({ item }: { item: Conversation }) => {
    const name = getConversationName(item);
    const other = getOtherParticipant(item);

    return (
      <Pressable onPress={() => handleConversationPress(item._id)}>
        <XStack
          padding="$4"
          gap="$3"
          alignItems="center"
          backgroundColor={isDark ? '#000000' : '#ffffff'}
          borderBottomWidth={0.5}
          borderBottomColor={isDark ? '#262626' : '#f3f4f6'}
        >
          <Avatar circular size="$5">
            {other?.profileImage ? (
              <Avatar.Image src={other.profileImage} />
            ) : (
              <Avatar.Fallback
                backgroundColor="#3b82f6"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontSize="$4" fontWeight="600">
                  {getInitials(name)}
                </Text>
              </Avatar.Fallback>
            )}
          </Avatar>

          <YStack flex={1}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text
                fontSize="$4"
                fontWeight="600"
                color={isDark ? '#fafafa' : '#111827'}
                numberOfLines={1}
                flex={1}
              >
                {name}
              </Text>
              {item.lastMessage && (
                <Text fontSize="$2" color={isDark ? '#737373' : '#6b7280'}>
                  {formatDistanceToNow(new Date(item.lastMessage.createdAt), {
                    addSuffix: false,
                  })}
                </Text>
              )}
            </XStack>
            {item.lastMessage && (
              <Text
                fontSize="$3"
                color={isDark ? '#a3a3a3' : '#4b5563'}
                numberOfLines={1}
                marginTop="$1"
              >
                {item.lastMessage.messageType === 'image'
                  ? '📷 Image'
                  : item.lastMessage.messageType === 'file'
                    ? '📎 File'
                    : item.lastMessage.content}
              </Text>
            )}
          </YStack>

          <Ionicons name="chevron-forward" size={16} color={isDark ? '#404040' : '#d1d5db'} />
        </XStack>
      </Pressable>
    );
  }, [isDark, currentUserId]);

  const renderEmpty = () => (
    <YStack flex={1} alignItems="center" justifyContent="center" paddingTop="$10" paddingHorizontal="$6">
      <YStack backgroundColor={isDark ? '#1a1a1a' : '#f8fafc'} padding="$6" borderRadius="$6" marginBottom="$4">
        <Ionicons name="chatbubbles-outline" size={48} color={isDark ? '#404040' : '#cbd5e1'} />
      </YStack>
      <Text fontSize="$5" fontWeight="600" color={isDark ? '#fafafa' : '#1e293b'} marginBottom="$2">
        No Conversations
      </Text>
      <Text fontSize="$3" color={isDark ? '#737373' : '#64748b'} textAlign="center">
        Start a new conversation to begin chatting with others
      </Text>
    </YStack>
  );

  if (isLoading && conversations.length === 0) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor={isDark ? '#000000' : '#ffffff'}>
          <Spinner size="large" color="#3b82f6" />
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
              Messages
            </Text>
            {unreadCount !== undefined && unreadCount > 0 && (
              <Text fontSize="$2" color="#3b82f6" fontWeight="600">
                {unreadCount} unread
              </Text>
            )}
          </YStack>
          <Pressable onPress={handleNewChat}>
            <XStack
              backgroundColor="#3b82f6"
              padding="$2"
              borderRadius="$3"
            >
              <Ionicons name="add" size={24} color="white" />
            </XStack>
          </Pressable>
        </XStack>

        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#3b82f6"
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />

        {/* FAB */}
        <XStack
          position="absolute"
          bottom={24}
          right={24}
          elevation={5}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={12}
        >
          <Pressable
            onPress={handleNewChat}
            style={({ pressed }) => ({
              backgroundColor: '#3b82f6',
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }]
            })}
          >
            <Ionicons name="add" size={32} color="white" />
          </Pressable>
        </XStack>
      </YStack>
    </ScreenLayout>
  );
}
