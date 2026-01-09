import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, Text, Avatar } from 'tamagui';
import { Message } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';

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

  return (
    <XStack
      alignItems="flex-end"
      gap="$2"
      paddingHorizontal="$3"
      paddingVertical="$1"
      flexDirection={isOwn ? 'row-reverse' : 'row'}
    >
      {/* Avatar */}
      {!isOwn && showAvatar && sender && (
        <Avatar circular size="$3">
          {sender.profileImage ? (
            <Avatar.Image src={sender.profileImage} />
          ) : (
            <Avatar.Fallback
              backgroundColor="$green9"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize="$2" fontWeight="600">
                {getInitials(sender.name)}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
      )}

      {/* Spacer when no avatar */}
      {!isOwn && !showAvatar && <YStack width={32} />}

      {/* Message bubble */}
      <Pressable
        onLongPress={() => onLongPress?.(message)}
        style={{ maxWidth: '75%' }}
      >
        <YStack
          backgroundColor={isOwn ? '$blue9' : '$gray4'}
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$4"
          borderBottomRightRadius={isOwn ? '$1' : '$4'}
          borderBottomLeftRadius={isOwn ? '$4' : '$1'}
        >
          {/* Sender name for group chats */}
          {!isOwn && showAvatar && sender && (
            <Text fontSize="$1" color="$blue9" fontWeight="600" marginBottom="$1">
              {sender.name}
            </Text>
          )}

          {/* Message content */}
          {message.isDeleted ? (
            <Text
              color={isOwn ? 'white' : '$gray11'}
              fontStyle="italic"
              opacity={0.7}
            >
              This message was deleted
            </Text>
          ) : message.messageType === 'image' && message.imageUrl ? (
            <Pressable onPress={() => onImagePress?.(message.imageUrl!)}>
              <YStack>
                <YStack
                  borderRadius="$3"
                  overflow="hidden"
                  marginBottom={message.content ? '$2' : 0}
                >
                  {/* Image placeholder - in real app would use Image component */}
                  <XStack
                    backgroundColor="$gray6"
                    width={200}
                    height={150}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="$3"
                  >
                    <Ionicons name="image" size={40} color="#666" />
                  </XStack>
                </YStack>
                {message.content && (
                  <Text color={isOwn ? 'white' : '$gray12'}>
                    {message.content}
                  </Text>
                )}
              </YStack>
            </Pressable>
          ) : message.messageType === 'file' ? (
            <XStack alignItems="center" gap="$2">
              <YStack
                backgroundColor={isOwn ? '$blue8' : '$gray5'}
                padding="$2"
                borderRadius="$2"
              >
                <Ionicons
                  name="document-attach"
                  size={20}
                  color={isOwn ? 'white' : '#666'}
                />
              </YStack>
              <YStack flex={1}>
                <Text
                  color={isOwn ? 'white' : '$gray12'}
                  fontWeight="500"
                  numberOfLines={1}
                >
                  {message.fileName || 'File'}
                </Text>
                {message.fileSize && (
                  <Text
                    color={isOwn ? 'rgba(255,255,255,0.7)' : '$gray11'}
                    fontSize="$1"
                  >
                    {(message.fileSize / 1024).toFixed(1)} KB
                  </Text>
                )}
              </YStack>
            </XStack>
          ) : (
            <Text color={isOwn ? 'white' : '$gray12'}>{message.content}</Text>
          )}

          {/* Time and read status */}
          <XStack
            alignItems="center"
            gap="$1"
            marginTop="$1"
            justifyContent={isOwn ? 'flex-end' : 'flex-start'}
          >
            <Text
              fontSize="$1"
              color={isOwn ? 'rgba(255,255,255,0.7)' : '$gray10'}
            >
              {formatTime(message.createdAt)}
            </Text>
            {isOwn && (
              <Ionicons
                name={message.readBy.length > 1 ? 'checkmark-done' : 'checkmark'}
                size={14}
                color="rgba(255,255,255,0.7)"
              />
            )}
          </XStack>
        </YStack>
      </Pressable>
    </XStack>
  );
}
