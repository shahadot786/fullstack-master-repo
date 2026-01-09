import React, { useState } from 'react';
import { TextInput, Pressable, Alert, Keyboard, Platform } from 'react-native';
import { XStack, YStack, Text, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SendMessageDto } from '@/types';
import { uploadApi } from '@/api/upload.api';
import { useTheme } from '@/hooks/useTheme';
import EmojiPicker, { emojiData } from '@hiraku-ai/react-native-emoji-picker';

interface ChatInputProps {
  onSend: (message: SendMessageDto) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    uploadedUrl?: string;
  } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = async () => {
    if ((!content.trim() && !selectedImage?.uploadedUrl) || disabled || isSending) {
      return;
    }

    Keyboard.dismiss();

    try {
      setIsSending(true);

      const message: SendMessageDto = {};

      if (selectedImage?.uploadedUrl) {
        message.messageType = 'image';
        message.imageUrl = selectedImage.uploadedUrl;
        message.content = content.trim() || undefined;
      } else {
        message.messageType = 'text';
        message.content = content.trim();
      }

      await onSend(message);

      // Clear state
      setContent('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({ uri: asset.uri });
        setIsUploading(true);

        try {
          // Upload image
          const uploaded = await uploadApi.uploadImage(asset.uri, 'chat-images');
          setSelectedImage({ uri: asset.uri, uploadedUrl: uploaded.url });
        } catch (error) {
          console.error('Failed to upload image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
          setSelectedImage(null);
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const canSend = (content.trim() || selectedImage?.uploadedUrl) && !disabled && !isSending && !isUploading;
  const textColor = isDark ? '#fafafa' : '#111827';
  const inputBg = isDark ? '#262626' : '#f3f4f6';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <YStack
      borderTopWidth={0.5}
      borderTopColor={borderColor}
      backgroundColor={isDark ? '#000000' : '#ffffff'}
      paddingHorizontal="$3"
      paddingVertical="$3"
    >
      {/* Image preview */}
      {selectedImage && (
        <XStack
          marginBottom="$3"
          alignItems="center"
          gap="$3"
          backgroundColor={isDark ? '#1a1a1a' : '#f8fafc'}
          padding="$2"
          borderRadius="$4"
          borderWidth={0.5}
          borderColor={borderColor}
        >
          <YStack position="relative">
            <YStack
              width={60}
              height={60}
              borderRadius="$2.5"
              backgroundColor={isDark ? '#262626' : '#f1f5f9'}
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {isUploading ? (
                <Spinner size="small" color="#3b82f6" />
              ) : (
                <Ionicons name="image" size={24} color={isDark ? '#525252' : '#94a3b8'} />
              )}
            </YStack>
            <Pressable
              onPress={handleRemoveImage}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: '#ef4444',
                borderRadius: 12,
                width: 24,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: isDark ? '#000' : '#fff',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }}
            >
              <Ionicons name="close" size={16} color="white" />
            </Pressable>
          </YStack>
          <Text flex={1} color={isDark ? '#a3a3a3' : '#64748b'} fontSize="$2" fontWeight="500">
            {isUploading ? 'Uploading to cloud...' : 'Image attachment ready'}
          </Text>
        </XStack>
      )}

      <EmojiPicker
        visible={showEmojiPicker}
        emojis={emojiData}
        onEmojiSelect={(emoji: string) => {
          setContent(prev => prev + emoji);
          setShowEmojiPicker(false);
        }}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* Input row */}
      <XStack alignItems="flex-end" gap="$1">
        {/* Attachment button */}
        <Pressable
          onPress={handlePickImage}
          disabled={disabled || isUploading}
          style={({ pressed }) => ({
            padding: 10,
            opacity: disabled || isUploading ? 0.4 : (pressed ? 0.6 : 1),
          })}
        >
          <Ionicons name="attach-outline" size={28} color={isDark ? '#737373' : '#94a3b8'} />
        </Pressable>

        {/* Emoji picker button */}
        <Pressable
          onPress={() => setShowEmojiPicker(true)}
          disabled={disabled || isSending}
          style={({ pressed }) => ({
            padding: 10,
            opacity: disabled || isSending ? 0.4 : (pressed ? 0.6 : 1),
          })}
        >
          <Ionicons name="happy-outline" size={26} color={isDark ? '#737373' : '#94a3b8'} />
        </Pressable>

        {/* Text input */}
        <YStack
          flex={1}
          backgroundColor={inputBg}
          borderRadius="$5"
          paddingHorizontal="$4"
          paddingVertical="$2"
          minHeight={42}
          maxHeight={120}
          borderWidth={0.5}
          borderColor={borderColor}
          justifyContent="center"
        >
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#525252' : '#94a3b8'}
            multiline
            editable={!disabled && !isSending}
            style={{
              fontSize: 16,
              color: textColor,
              lineHeight: 20,
              paddingTop: Platform.OS === 'ios' ? 8 : 4,
              paddingBottom: Platform.OS === 'ios' ? 8 : 4,
            }}
          />
        </YStack>

        {/* Send button */}
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={({ pressed }) => ({
            backgroundColor: canSend ? '#3b82f6' : (isDark ? '#1a1a1a' : '#f1f5f9'),
            borderRadius: 22,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            marginBottom: 2,
            opacity: canSend && pressed ? 0.8 : 1,
            transform: [{ scale: canSend && pressed ? 0.95 : 1 }],
          })}
        >
          {isSending ? (
            <Spinner size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color={canSend ? 'white' : (isDark ? '#404040' : '#cbd5e1')} />
          )}
        </Pressable>
      </XStack>
    </YStack >
  );
}
