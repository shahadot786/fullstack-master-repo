import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { XStack, YStack, Text, Avatar, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useInfiniteConversations, useUnreadCount } from '@/hooks/useChat';
import { useShoutboxMessages, useSendShoutboxMessage } from '@/hooks/useShoutbox';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Conversation, ChatUser, ShoutboxMessage } from '@/types';
import { ShoutboxBubble } from '@/components/chat/ShoutboxBubble';

type ChatTab = 'direct' | 'shoutbox';

export default function ChatScreen() {
    const router = useRouter();
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<ChatTab>('shoutbox');
    const [shoutContent, setShoutContent] = useState('');
    const { user } = useAuthStore();
    const currentUserId = user?._id;

    // Direct Conversations
    const {
        data: conversationsData,
        isLoading: isLoadingConversations,
        isRefetching: isRefetchingConversations,
        refetch: refetchConversations,
        fetchNextPage: fetchNextConversationsPage,
        hasNextPage: hasNextConversationsPage,
        isFetchingNextPage: isFetchingNextConversationsPage,
    } = useInfiniteConversations();

    const { data: unreadCount } = useUnreadCount();

    // Shoutbox Messages
    const {
        data: shoutboxData,
        isLoading: isLoadingShoutbox,
        isRefetching: isRefetchingShoutbox,
        refetch: refetchShoutbox,
        fetchNextPage: fetchNextShoutboxPage,
        hasNextPage: hasNextShoutboxPage,
        isFetchingNextPage: isFetchingNextShoutboxPage,
    } = useShoutboxMessages();

    const sendShoutboxMessageMutation = useSendShoutboxMessage();

    const conversations = useMemo(() => {
        if (!conversationsData?.pages) return [];
        return conversationsData.pages.flatMap((page) => page.data);
    }, [conversationsData]);

    const shoutboxMessages = useMemo(() => {
        if (!shoutboxData?.pages) return [];
        const all = shoutboxData.pages.flatMap((page) => page.data);
        // Sort by date (descending for FlatList)
        return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [shoutboxData]);

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
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleConversationPress = (conversation: Conversation) => {
        router.push({
            pathname: '/conversation/[id]',
            params: { id: conversation._id },
        });
    };

    const handleNewChat = () => {
        router.push('/new-chat');
    };

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

    const renderConversationItem = useCallback(
        ({ item }: { item: Conversation }) => {
            const name = getConversationName(item);
            const other = getOtherParticipant(item);

            return (
                <Pressable onPress={() => handleConversationPress(item)}>
                    <XStack
                        padding="$4"
                        gap="$3"
                        alignItems="center"
                        backgroundColor="$background"
                        borderBottomWidth={1}
                        borderBottomColor="$borderColor"
                    >
                        <Avatar circular size="$5">
                            {other?.profileImage ? (
                                <Avatar.Image src={other.profileImage} />
                            ) : (
                                <Avatar.Fallback
                                    backgroundColor="$blue9"
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
                                    color="$color"
                                    numberOfLines={1}
                                    flex={1}
                                >
                                    {name}
                                </Text>
                                {item.lastMessage && (
                                    <Text fontSize="$2" color="$gray10">
                                        {formatDistanceToNow(new Date(item.lastMessage.createdAt), {
                                            addSuffix: false,
                                        })}
                                    </Text>
                                )}
                            </XStack>
                            {item.lastMessage && (
                                <Text
                                    fontSize="$3"
                                    color="$gray11"
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

                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </XStack>
                </Pressable>
            );
        },
        [currentUserId, getConversationName, getOtherParticipant, handleConversationPress]
    );

    const renderShoutboxItem = useCallback(({ item }: { item: ShoutboxMessage }) => {
        const isOwn = (typeof item.senderId === 'string' && item.senderId === currentUserId) ||
            (typeof item.senderId === 'object' && item.senderId._id === currentUserId);

        return <ShoutboxBubble message={item} isOwn={isOwn} />;
    }, [currentUserId]);

    const handleLoadMore = () => {
        if (activeTab === 'direct') {
            if (hasNextConversationsPage && !isFetchingNextConversationsPage) {
                fetchNextConversationsPage();
            }
        } else {
            if (hasNextShoutboxPage && !isFetchingNextShoutboxPage) {
                fetchNextShoutboxPage();
            }
        }
    };

    const renderEmpty = () => (
        <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingTop="$10"
            paddingHorizontal="$6"
        >
            <YStack
                backgroundColor="$gray4"
                padding="$6"
                borderRadius="$6"
                marginBottom="$4"
            >
                <Ionicons
                    name={activeTab === 'direct' ? "chatbubbles" : "megaphone"}
                    size={48}
                    color="#6b7280"
                />
            </YStack>
            <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$2">
                {activeTab === 'direct' ? "No Conversations" : "Shoutbox is Empty"}
            </Text>
            <Text fontSize="$3" color="$gray11" textAlign="center">
                {activeTab === 'direct'
                    ? "Start a new conversation to begin chatting with others"
                    : "Be the first one to say something to everyone!"}
            </Text>
        </YStack>
    );

    const renderFooter = () => {
        if (activeTab === 'direct' ? !isFetchingNextConversationsPage : !isFetchingNextShoutboxPage) return null;
        return (
            <YStack padding="$4" alignItems="center">
                <Spinner size="small" color="$blue9" />
            </YStack>
        );
    };

    if ((activeTab === 'direct' && isLoadingConversations) || (activeTab === 'shoutbox' && isLoadingShoutbox && shoutboxMessages.length === 0)) {
        return (
            <ScreenLayout>
                <YStack flex={1} alignItems="center" justifyContent="center">
                    <Spinner size="large" color="$blue9" />
                    <Text marginTop="$4" color="$gray11">
                        {activeTab === 'direct' ? "Loading conversations..." : "Entering Shoutbox..."}
                    </Text>
                </YStack>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            <YStack flex={1}>
                {/* Header */}
                <XStack
                    padding="$4"
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottomWidth={1}
                    borderBottomColor="$borderColor"
                    backgroundColor="$background"
                >
                    <YStack>
                        <Text fontSize="$6" fontWeight="bold" color="$color">
                            {activeTab === 'direct' ? "Messages" : "Shoutbox"}
                        </Text>
                        {activeTab === 'direct' && unreadCount !== undefined && unreadCount > 0 && (
                            <Text fontSize="$2" color="$blue9">
                                {unreadCount} unread
                            </Text>
                        )}
                        {activeTab === 'shoutbox' && (
                            <Text fontSize="$2" color="$green10">
                                &bull; Public Room
                            </Text>
                        )}
                    </YStack>
                    <Pressable onPress={handleNewChat}>
                        <YStack
                            backgroundColor="$blue9"
                            padding="$2"
                            borderRadius="$3"
                        >
                            <Ionicons name="add" size={24} color="white" />
                        </YStack>
                    </Pressable>
                </XStack>

                {/* Tab Switcher */}
                <XStack paddingHorizontal="$4" paddingVertical="$2" gap="$2" backgroundColor="$gray2">
                    <Pressable
                        onPress={() => setActiveTab('direct')}
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 8,
                            backgroundColor: activeTab === 'direct' ? '#3b82f6' : 'transparent',
                            alignItems: 'center'
                        }}
                    >
                        <Text fontWeight="600" color={activeTab === 'direct' ? 'white' : '$gray11'}>Direct</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab('shoutbox')}
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 8,
                            backgroundColor: activeTab === 'shoutbox' ? '#3b82f6' : 'transparent',
                            alignItems: 'center'
                        }}
                    >
                        <Text fontWeight="600" color={activeTab === 'shoutbox' ? 'white' : '$gray11'}>Shoutbox</Text>
                    </Pressable>
                </XStack>

                {/* Content List */}
                {activeTab === 'direct' ? (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item._id}
                        renderItem={renderConversationItem}
                        ListEmptyComponent={renderEmpty}
                        ListFooterComponent={renderFooter}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetchingConversations}
                                onRefresh={refetchConversations}
                                tintColor="#3b82f6"
                            />
                        }
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                ) : (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    >
                        <FlatList
                            data={shoutboxMessages}
                            keyExtractor={(item) => item._id}
                            renderItem={renderShoutboxItem}
                            inverted
                            ListEmptyComponent={renderEmpty}
                            ListFooterComponent={renderFooter}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetchingShoutbox}
                                    onRefresh={refetchShoutbox}
                                    tintColor="#3b82f6"
                                />
                            }
                            contentContainerStyle={{ paddingVertical: 10 }}
                        />

                        {/* Shoutbox Input */}
                        <XStack
                            padding="$3"
                            backgroundColor="$background"
                            borderTopWidth={0.5}
                            borderTopColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            alignItems="flex-end"
                            gap="$2"
                        >
                            <YStack
                                flex={1}
                                backgroundColor={isDark ? '#262626' : '#f3f4f6'}
                                borderRadius="$5"
                                paddingHorizontal="$4"
                                paddingVertical="$2.5"
                                borderWidth={0.5}
                                borderColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            >
                                <TextInput
                                    placeholder="Shout something..."
                                    placeholderTextColor={isDark ? '#737373' : '#9ca3af'}
                                    value={shoutContent}
                                    onChangeText={setShoutContent}
                                    multiline
                                    style={{
                                        fontSize: 16,
                                        color: isDark ? '#fafafa' : '#111827',
                                        maxHeight: 120,
                                        lineHeight: 20,
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                    }}
                                />
                            </YStack>
                            <Pressable
                                onPress={handleSendShout}
                                disabled={!shoutContent.trim() || sendShoutboxMessageMutation.isPending}
                                style={({ pressed }) => ({
                                    backgroundColor: shoutContent.trim() ? '#3b82f6' : (isDark ? '#333' : '#e5e7eb'),
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: (shoutContent.trim() && pressed) ? 0.8 : 1,
                                    transform: [{ scale: (shoutContent.trim() && pressed) ? 0.95 : 1 }]
                                })}
                            >
                                {sendShoutboxMessageMutation.isPending ? (
                                    <Spinner size="small" color="white" />
                                ) : (
                                    <Ionicons
                                        name="send"
                                        size={20}
                                        color={shoutContent.trim() ? 'white' : (isDark ? '#666' : '#9ca3af')}
                                    />
                                )}
                            </Pressable>
                        </XStack>
                    </KeyboardAvoidingView>
                )}

                {/* FAB for new chat - only show on Direct tab */}
                {activeTab === 'direct' && (
                    <XStack
                        position="absolute"
                        bottom={20}
                        right={20}
                        elevation={5}
                        shadowColor="#000"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.25}
                        shadowRadius={4}
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
                )}
            </YStack>
        </ScreenLayout>
    );
}
