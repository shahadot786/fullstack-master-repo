import React, { useEffect } from 'react';
import { Pressable, Animated, Dimensions } from 'react-native';
import { XStack, YStack, Text, Avatar } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotificationStore } from '@/store/notificationStore';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * InAppNotificationBanner Component
 * 
 * Displays a notification banner at the top of the screen when new messages arrive.
 * Includes slide-in animation and tap-to-navigate functionality.
 */
export function InAppNotificationBanner() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { currentNotification, isVisible, hideNotification } = useNotificationStore();

  const translateY = React.useRef(new Animated.Value(-120)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible && currentNotification) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: -120,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, currentNotification, translateY, opacity]);

  const handlePress = () => {
    hideNotification();

    if (currentNotification?.type === 'chat' && currentNotification.conversationId) {
      router.push({
        pathname: '/(main)/(chat)/conversation/[id]',
        params: { id: currentNotification.conversationId },
      });
    } else if (currentNotification?.type === 'shoutbox') {
      router.push('/(main)/(chat)/(tabs)/shoutbox');
    }
  };

  const handleDismiss = () => {
    hideNotification();
  };

  if (!currentNotification) return null;

  const backgroundColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#f9fafb' : '#111827';
  const secondaryTextColor = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const iconBgColor = currentNotification.type === 'shoutbox' ? '#8b5cf6' : '#3b82f6';

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <Pressable onPress={handlePress}>
        <XStack
          backgroundColor={backgroundColor}
          padding="$3"
          borderRadius="$4"
          alignItems="center"
          gap="$3"
          borderWidth={1}
          borderColor={borderColor}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Icon/Avatar */}
          {currentNotification.type === 'shoutbox' ? (
            <YStack
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor={iconBgColor}
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="megaphone" size={22} color="white" />
            </YStack>
          ) : currentNotification.senderImage ? (
            <Avatar circular size="$4">
              <Avatar.Image src={currentNotification.senderImage} />
              <Avatar.Fallback backgroundColor={iconBgColor} />
            </Avatar>
          ) : (
            <YStack
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor={iconBgColor}
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize={14} fontWeight="700">
                {getInitials(currentNotification.senderName)}
              </Text>
            </YStack>
          )}

          {/* Content */}
          <YStack flex={1} gap="$0.5">
            <XStack alignItems="center" gap="$2">
              <Text fontSize={14} fontWeight="700" color={textColor} numberOfLines={1} flex={1}>
                {currentNotification.title}
              </Text>
              <Text fontSize={11} color={secondaryTextColor}>
                now
              </Text>
            </XStack>
            <Text fontSize={13} color={secondaryTextColor} numberOfLines={2}>
              {currentNotification.message}
            </Text>
          </YStack>

          {/* Dismiss button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            style={({ pressed }) => ({
              padding: 4,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Ionicons name="close" size={20} color={secondaryTextColor} />
          </Pressable>
        </XStack>
      </Pressable>
    </Animated.View>
  );
}
