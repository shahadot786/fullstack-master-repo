import React from 'react';
import { XStack, YStack, Text, Avatar } from 'tamagui';
import { ShoutboxMessage } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ShoutboxBubbleProps {
  message: ShoutboxMessage;
  isOwn: boolean;
}

export function ShoutboxBubble({ message, isOwn }: ShoutboxBubbleProps) {
  const sender = message.senderId;

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
      {!isOwn && (
        <Avatar circular size="$3">
          {sender.profileImage ? (
            <Avatar.Image src={sender.profileImage} />
          ) : (
            <Avatar.Fallback
              backgroundColor="$blue9"
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

      {/* Message bubble */}
      <YStack
        style={{ maxWidth: '75%' }}
        backgroundColor={isOwn ? '$blue9' : '$gray4'}
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$4"
        borderBottomRightRadius={isOwn ? '$1' : '$4'}
        borderBottomLeftRadius={isOwn ? '$4' : '$1'}
      >
        {/* Sender name for guest users */}
        {!isOwn && (
          <Text fontSize="$1" color="$blue9" fontWeight="600" marginBottom="$1">
            {sender.name}
          </Text>
        )}

        {/* Message content */}
        <Text color={isOwn ? 'white' : '$gray12'}>{message.content}</Text>

        {/* Time */}
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
        </XStack>
      </YStack>
    </XStack>
  );
}
