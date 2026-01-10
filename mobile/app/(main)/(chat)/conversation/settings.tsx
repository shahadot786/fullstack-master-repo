import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { YStack, Text, XStack, Avatar, Spinner } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useConversation, useUpdateConversation, useLeaveConversation } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';
import { uploadApi } from '@/api/upload.api';

export default function ConversationSettingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();

  const { data: conversation, isLoading: isLoadingConversation } = useConversation(id!);
  const updateConversationMutation = useUpdateConversation(id!);
  const leaveConversationMutation = useLeaveConversation();

  const [groupName, setGroupName] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (conversation?.name) {
      setGroupName(conversation.name);
    }
  }, [conversation]);

  const handleUpdateName = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      await updateConversationMutation.mutateAsync({ name: groupName.trim() });
      Alert.alert('Success', 'Group name updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update group name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadGroupImage(result.assets[0].uri);
    }
  };

  const uploadGroupImage = async (uri: string) => {
    try {
      setIsUploadingImage(true);
      const uploadResult = await uploadApi.uploadFile(uri, 'chat-images');
      await updateConversationMutation.mutateAsync({ image: uploadResult.url });
      Alert.alert('Success', 'Group image updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveConversationMutation.mutateAsync(id!);
              router.replace('/(main)/(chat)/(tabs)');
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to leave group');
            }
          },
        },
      ]
    );
  };

  if (isLoadingConversation) {
    return (
      <ScreenLayout>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="#3b82f6" />
        </YStack>
      </ScreenLayout>
    );
  }

  const isGroup = conversation?.type === 'group';
  const textColor = isDark ? '#fafafa' : '#111827';
  const secondaryTextColor = isDark ? '#a3a3a3' : '#6b7280';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const borderColor = isDark ? '#262626' : '#f3f4f6';

  return (
    <ScreenLayout showHeader={false}>
      <YStack flex={1} backgroundColor={isDark ? '#000000' : '#ffffff'}>
        {/* Custom Header */}
        <XStack
          padding="$4"
          gap="$3"
          alignItems="center"
          borderBottomWidth={0.5}
          borderBottomColor={borderColor}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={secondaryTextColor} />
          </TouchableOpacity>

          <Text fontSize="$6" fontWeight="700" color={textColor} flex={1}>
            Chat Settings
          </Text>
        </XStack>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <YStack gap="$6">
              {/* Group Header */}
              <YStack alignItems="center" gap="$4">
                <TouchableOpacity onPress={isGroup ? handleImagePicker : undefined} disabled={!isGroup || isUploadingImage}>
                  <YStack position="relative">
                    <Avatar circular size="$10">
                      {conversation?.image ? (
                        <Avatar.Image src={conversation.image} />
                      ) : (
                        <Avatar.Fallback backgroundColor="#3b82f6" alignItems="center" justifyContent="center">
                          <Ionicons name={isGroup ? "people" : "person"} size={40} color="white" />
                        </Avatar.Fallback>
                      )}
                    </Avatar>
                    {isGroup && (
                      <YStack
                        position="absolute"
                        bottom={0}
                        right={0}
                        backgroundColor="#3b82f6"
                        padding="$2"
                        borderRadius="$10"
                        borderWidth={3}
                        borderColor={isDark ? '#000' : '#fff'}
                      >
                        {isUploadingImage ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Ionicons name="camera" size={16} color="white" />
                        )}
                      </YStack>
                    )}
                  </YStack>
                </TouchableOpacity>

                <YStack alignItems="center">
                  <Text fontSize="$6" fontWeight="700" color={textColor}>
                    {conversation?.name || (isGroup ? 'Unnamed Group' : 'Direct Message')}
                  </Text>
                  <Text fontSize="$3" color={secondaryTextColor}>
                    {conversation?.participants.length} participants
                  </Text>
                </YStack>
              </YStack>

              {/* Edit Name Section (Group only) */}
              {isGroup && (
                <YStack gap="$3" backgroundColor={cardBg} padding="$4" borderRadius="$4" borderWidth={1} borderColor={borderColor}>
                  <Text fontSize="$4" fontWeight="600" color={textColor}>Group Name</Text>
                  <XStack gap="$2" alignItems="flex-end">
                    <YStack flex={1}>
                      <Input
                        label="New Name"
                        placeholder="Enter group name"
                        value={groupName}
                        onChangeText={setGroupName}
                      />
                    </YStack>
                    <Button
                      title="Update"
                      onPress={handleUpdateName}
                      loading={isSaving}
                      disabled={groupName === conversation?.name || !groupName.trim()}
                    />
                  </XStack>
                </YStack>
              )}

              {/* Participants List */}
              <YStack gap="$3">
                <Text fontSize="$4" fontWeight="600" color={textColor} paddingLeft="$2">Participants</Text>
                <YStack backgroundColor={cardBg} borderRadius="$4" borderWidth={1} borderColor={borderColor} overflow="hidden">
                  {conversation?.participants.map((participant, index) => (
                    <XStack
                      key={participant._id}
                      padding="$3"
                      alignItems="center"
                      gap="$3"
                      borderBottomWidth={index === conversation.participants.length - 1 ? 0 : 1}
                      borderBottomColor={borderColor}
                    >
                      <Avatar circular size="$4">
                        {participant.profileImage ? (
                          <Avatar.Image src={participant.profileImage} />
                        ) : (
                          <Avatar.Fallback backgroundColor="#94a3b8" alignItems="center" justifyContent="center">
                            <Text color="white" fontSize="$1">{participant.name.charAt(0)}</Text>
                          </Avatar.Fallback>
                        )}
                      </Avatar>
                      <YStack flex={1}>
                        <Text color={textColor} fontWeight="500">{participant.name}</Text>
                        <Text color={secondaryTextColor} fontSize="$2">{participant.email}</Text>
                      </YStack>
                    </XStack>
                  ))}
                </YStack>
              </YStack>

              {/* Actions */}
              <YStack gap="$3">
                <TouchableOpacity onPress={handleLeaveGroup}>
                  <XStack
                    backgroundColor={cardBg}
                    padding="$4"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="#fee2e2"
                    alignItems="center"
                    gap="$3"
                  >
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                    <Text color="#ef4444" fontWeight="600">Leave Group</Text>
                  </XStack>
                </TouchableOpacity>
              </YStack>
            </YStack>
          </ScrollView>
        </KeyboardAvoidingView>
      </YStack>
    </ScreenLayout>
  );
}
