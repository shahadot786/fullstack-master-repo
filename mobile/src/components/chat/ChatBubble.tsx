import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, Text, Avatar } from 'tamagui';
import { Message } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onImagePress?: (imageUrl: string) => void;
  onLongPress?: (message: Message) => void;
}

export function ChatBubble({
  message,
  isOwn,
  showAvatar = true,
  onImagePress,
  onLongPress,
}: ChatBubbleProps) {
  const sender = typeof message.senderId === 'object' ? message.senderId : null;

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: false });
  };

  const { isDark } = useTheme();

  const bubbleBg = isOwn ? '#3b82f6' : (isDark ? '#262626' : '#f3f4f6');
  const textColor = isOwn ? 'white' : (isDark ? '#fafafa' : '#111827');
  const secondaryTextColor = isOwn ? 'rgba(255,255,255,0.7)' : (isDark ? '#a3a3a3' : '#6b7280');
  const senderNameColor = '#3b82f6';

  return (
    <XStack
      alignItems="flex-end"
      gap="$2"
      paddingHorizontal="$3"
      paddingVertical="$1.5"
      flexDirection={isOwn ? 'row-reverse' : 'row'}
    >
      {/* Avatar */}
      {!isOwn && showAvatar && sender && (
        <Avatar circular size="$2.5">
          {sender.profileImage ? (
            <Avatar.Image src={sender.profileImage} />
          ) : (
            <Avatar.Fallback
              backgroundColor="#3b82f6"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize="$1" fontWeight="600">
                {getInitials(sender.name)}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
      )}

      {/* Spacer when no avatar */}
      {!isOwn && !showAvatar && <YStack width={28} />}

      {/* Message bubble */}
      <Pressable
        onLongPress={() => onLongPress?.(message)}
        style={{ maxWidth: '80%' }}
      >
        <YStack
          backgroundColor={bubbleBg}
          paddingHorizontal="$3.5"
          paddingVertical="$2"
          borderRadius="$5"
          borderBottomRightRadius={isOwn ? '$1' : '$5'}
          borderBottomLeftRadius={isOwn ? '$5' : '$1'}
        >
          {/* Sender name for group chats */}
          {!isOwn && showAvatar && sender && (
            <Text fontSize="$1" color={senderNameColor} fontWeight="700" marginBottom="$0.5">
              {sender.name}
            </Text>
          )}

          {/* Message content */}
          {message.isDeleted ? (
            <Text
              color={secondaryTextColor}
              fontStyle="italic"
              fontSize="$3"
            >
              This message was deleted
            </Text>
          ) : message.messageType === 'image' && message.imageUrl ? (
            <Pressable onPress={() => onImagePress?.(message.imageUrl!)}>
              <YStack>
                <YStack
                  borderRadius="$3.5"
                  overflow="hidden"
                  marginBottom={message.content ? '$2' : 0}
                >
                  <XStack
                    backgroundColor={isDark ? '#1a1a1a' : '#e5e7eb'}
                    width={220}
                    height={160}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons name="image" size={32} color={isDark ? '#404040' : '#9ca3af'} />
                  </XStack>
                </YStack>
                {message.content && (
                  <Text color={textColor} fontSize="$3.5" lineHeight={20}>
                    {message.content}
                  </Text>
                )}
              </YStack>
            </Pressable>
          ) : message.messageType === 'file' ? (
            <XStack alignItems="center" gap="$3" paddingVertical="$1">
              <YStack
                backgroundColor={isOwn ? 'rgba(255,255,255,0.2)' : (isDark ? '#333' : '#e5e7eb')}
                padding="$2"
                borderRadius="$3"
              >
                <Ionicons
                  name="document"
                  size={24}
                  color={isOwn ? 'white' : '#3b82f6'}
                />
              </YStack>
              <YStack flex={1}>
                <Text
                  color={textColor}
                  fontWeight="600"
                  fontSize="$3"
                  numberOfLines={1}
                >
                  {message.fileName || 'File'}
                </Text>
                {message.fileSize && (
                  <Text
                    color={secondaryTextColor}
                    fontSize="$1"
                  >
                    {(message.fileSize / 1024).toFixed(1)} KB
                  </Text>
                )}
              </YStack>
            </XStack>
          ) : (
            <Text color={textColor} fontSize="$3.5" lineHeight={20}>{message.content}</Text>
          )}

          {/* Time and read status */}
          <XStack
            alignItems="center"
            gap="$1.5"
            marginTop="$1"
            justifyContent={isOwn ? 'flex-end' : 'flex-start'}
          >
            <Text
              fontSize="$1"
              color={secondaryTextColor}
            >
              {formatTime(message.createdAt)}
            </Text>
            {isOwn && (
              <Ionicons
                name={message.readBy.length > 1 ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={secondaryTextColor}
              />
            )}
          </XStack>
        </YStack>
      </Pressable>
    </XStack>
  );
}
