import React, { useState } from 'react';
import { FlatList, TextInput, Pressable, Alert } from 'react-native';
import { XStack, YStack, Text, Avatar, Spinner, Theme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useCreateConversation } from '@/hooks/useChat';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { useTheme } from '@/hooks/useTheme';

interface UserSearchResult {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export default function NewChatScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createConversationMutation = useCreateConversation();

  const textColor = isDark ? '#fafafa' : '#111827';
  const secondaryTextColor = isDark ? '#a3a3a3' : '#6b7280';
  const inputBg = isDark ? '#1a1a1a' : '#f3f4f6';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  // Search users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchUsers', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get('/user/all', {
        params: { search: searchQuery || '', limit: 50 },
      });
      // The backend returns { success: true, data: { users: [], total: 0 } }
      return (response.data.data?.users || []) as UserSearchResult[];
    },
    // Always fetch some initial users, but search when query is long enough
    enabled: true,
  });

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSelectUser = (user: UserSearchResult) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Select Users', 'Please select at least one user to chat with');
      return;
    }

    try {
      setIsCreating(true);
      const conversation = await createConversationMutation.mutateAsync({
        participantIds: selectedUsers.map((u) => u._id),
        type: selectedUsers.length > 1 ? 'group' : 'direct',
      });

      router.replace({
        pathname: '/conversation/[id]',
        params: { id: conversation._id },
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      Alert.alert('Error', 'Failed to create conversation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const isUserSelected = (userId: string) => {
    return selectedUsers.some((u) => u._id === userId);
  };

  const renderUserItem = ({ item }: { item: UserSearchResult }) => (
    <Pressable onPress={() => handleSelectUser(item)}>
      <XStack
        padding="$4"
        gap="$3"
        alignItems="center"
        backgroundColor={isUserSelected(item._id) ? (isDark ? '$blue2' : '$blue1') : '$background'}
        borderBottomWidth={0.5}
        borderBottomColor={borderColor}
      >
        {/* Avatar */}
        <Avatar circular size="$5">
          {item.profileImage ? (
            <Avatar.Image src={item.profileImage} />
          ) : (
            <Avatar.Fallback
              backgroundColor="$blue9"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                {getInitials(item.name)}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>

        {/* Info */}
        <YStack flex={1}>
          <Text fontSize="$4" fontWeight="600" color="$color">
            {item.name}
          </Text>
          <Text fontSize="$3" color={secondaryTextColor}>
            {item.email}
          </Text>
        </YStack>

        {/* Checkbox */}
        <YStack
          width={24}
          height={24}
          borderRadius={12}
          borderWidth={1.5}
          borderColor={isUserSelected(item._id) ? '$blue9' : (isDark ? '$gray8' : '$gray6')}
          backgroundColor={isUserSelected(item._id) ? '$blue9' : 'transparent'}
          alignItems="center"
          justifyContent="center"
        >
          {isUserSelected(item._id) && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </YStack>
      </XStack>
    </Pressable>
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <XStack
        padding="$4"
        gap="$3"
        alignItems="center"
        borderBottomWidth={0.5}
        borderBottomColor={borderColor}
        backgroundColor="$background"
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={secondaryTextColor} />
        </Pressable>

        <Text fontSize="$5" fontWeight="700" color="$color" flex={1}>
          New Conversation
        </Text>

        <Pressable
          onPress={handleCreateConversation}
          disabled={selectedUsers.length === 0 || isCreating}
          style={({ pressed }) => ({
            opacity: selectedUsers.length === 0 || isCreating ? 0.5 : (pressed ? 0.7 : 1),
          })}
        >
          {isCreating ? (
            <Spinner size="small" color="$blue9" />
          ) : (
            <Text color="$blue9" fontWeight="700" fontSize="$4">
              Create
            </Text>
          )}
        </Pressable>
      </XStack>

      {/* Selected users chips */}
      {selectedUsers.length > 0 && (
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          gap="$2"
          flexWrap="wrap"
          borderBottomWidth={0.5}
          borderBottomColor={borderColor}
        >
          {selectedUsers.map((user) => (
            <Pressable key={user._id} onPress={() => handleSelectUser(user)}>
              <XStack
                backgroundColor="$blue9"
                paddingHorizontal="$3"
                paddingVertical="$1.5"
                borderRadius="$10"
                gap="$2"
                alignItems="center"
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {user.name}
                </Text>
                <Ionicons name="close-circle" size={16} color="white" />
              </XStack>
            </Pressable>
          ))}
        </XStack>
      )}

      {/* Search input container */}
      <YStack padding="$4" gap="$3">
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$2.5"
          gap="$2"
          alignItems="center"
          backgroundColor={inputBg}
          borderRadius="$4"
          borderWidth={0.5}
          borderColor={borderColor}
        >
          <Ionicons name="search" size={20} color={secondaryTextColor} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search users..."
            placeholderTextColor={secondaryTextColor}
            style={{
              flex: 1,
              fontSize: 16,
              color: textColor,
              height: 30,
            }}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={secondaryTextColor} />
            </Pressable>
          )}
        </XStack>
      </YStack>

      {/* Results */}
      {isSearching ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$blue9" />
        </YStack>
      ) : searchResults?.length === 0 ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
          <YStack
            backgroundColor={isDark ? '$gray2' : '$gray1'}
            padding="$6"
            borderRadius="$10"
            alignItems="center"
            gap="$4"
          >
            <Ionicons name="search-outline" size={48} color={secondaryTextColor} />
            <Text fontSize="$4" color={secondaryTextColor} textAlign="center">
              {searchQuery.length < 2 ? 'Search for users by name or email' : `No users found matching "${searchQuery}"`}
            </Text>
          </YStack>
        </YStack>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenLayout>
  );
}
