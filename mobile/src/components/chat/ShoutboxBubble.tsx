import React from 'react';
import { XStack, YStack, Text, Avatar } from 'tamagui';
import { ShoutboxMessage } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/hooks/useTheme';

interface ShoutboxBubbleProps {
  message: ShoutboxMessage;
  isOwn: boolean;
}

export function ShoutboxBubble({ message, isOwn }: ShoutboxBubbleProps) {
  const { isDark } = useTheme();
  const sender = message.senderId;

  const bubbleBg = isOwn ? '#3b82f6' : (isDark ? '#262626' : '#f3f4f6');
  const textColor = isOwn ? 'white' : (isDark ? '#fafafa' : '#111827');
  const secondaryTextColor = isOwn ? 'rgba(255,255,255,0.7)' : (isDark ? '#a3a3a3' : '#6b7280');
  const senderNameColor = '#3b82f6';

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
      paddingVertical="$1.5"
      flexDirection={isOwn ? 'row-reverse' : 'row'}
    >
      {/* Avatar */}
      {!isOwn && (
        <Avatar circular size="$2.5">
          {sender.profileImage ? (
            <Avatar.Image src={sender.profileImage} />
          ) : (
            <Avatar.Fallback
              backgroundColor="#3b82f6"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize={11} fontWeight="600">
                {getInitials(sender.name)}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
      )}

      {/* Message bubble */}
      <YStack
        style={{ maxWidth: '80%' }}
        backgroundColor={bubbleBg}
        paddingHorizontal="$3.5"
        paddingVertical="$2"
        borderRadius="$5"
        borderBottomRightRadius={isOwn ? '$1' : '$5'}
        borderBottomLeftRadius={isOwn ? '$5' : '$1'}
      >
        {/* Sender name */}
        {!isOwn && (
          <Text fontSize={11} color={senderNameColor} fontWeight="700" marginBottom="$0.5">
            {sender.name}
          </Text>
        )}

        {/* Message content */}
        <Text color={textColor} fontSize={15} lineHeight={20}>{message.content}</Text>

        {/* Time */}
        <XStack
          alignItems="center"
          gap="$1.5"
          marginTop="$1"
          justifyContent={isOwn ? 'flex-end' : 'flex-start'}
        >
          <Text
            fontSize={11}
            color={secondaryTextColor}
          >
            {formatTime(message.createdAt)}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
}
