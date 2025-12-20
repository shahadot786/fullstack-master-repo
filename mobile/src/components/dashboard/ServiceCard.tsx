import React from 'react';
import { Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface ServiceCardProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    stats: { label: string; value: number | string }[];
    route: string;
    iconColor: string;
}

export function ServiceCard({ title, icon, stats, route, iconColor }: ServiceCardProps) {
    const router = useRouter();
    const { isDark } = useTheme();

    const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
    const borderColor = isDark ? '#262626' : '#e5e5e5';
    const textColor = isDark ? '#fafafa' : '#171717';
    const secondaryTextColor = isDark ? '#a3a3a3' : '#737373';

    return (
        <Pressable
            onPress={() => router.push(route as any)}
            style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
            })}
        >
            <YStack
                backgroundColor={backgroundColor}
                borderRadius={12}
                padding="$4"
                borderWidth={1}
                borderColor={borderColor}
                gap="$3"
            >
                <XStack alignItems="center" gap="$3">
                    <YStack
                        width={48}
                        height={48}
                        borderRadius={24}
                        backgroundColor={`${iconColor}20`}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Ionicons name={icon} size={24} color={iconColor} />
                    </YStack>
                    <Text color={textColor} fontSize="$5" fontWeight="600" flex={1}>
                        {title}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
                </XStack>

                <XStack gap="$4" flexWrap="wrap">
                    {stats.map((stat, index) => (
                        <YStack key={index} flex={1} minWidth={80}>
                            <Text color={textColor} fontSize="$6" fontWeight="700">
                                {stat.value}
                            </Text>
                            <Text color={secondaryTextColor} fontSize="$2">
                                {stat.label}
                            </Text>
                        </YStack>
                    ))}
                </XStack>
            </YStack>
        </Pressable>
    );
}
