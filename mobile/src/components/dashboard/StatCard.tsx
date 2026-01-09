import React from 'react';
import { Pressable } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


interface StatCardProps {
    title: string;
    value: number | string;
    icon: keyof typeof Ionicons.glyphMap;
    gradientColors: [string, string, ...string[]];
    onPress?: () => void;
}

export function StatCard({ title, value, icon, gradientColors, onPress }: StatCardProps) {


    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderRadius: 16,
                    padding: 16,
                    minHeight: 100,
                }}
            >
                <YStack gap="$2">
                    <Ionicons name={icon} size={32} color="white" />
                    <Text color="white" fontSize="$8" fontWeight="700">
                        {value}
                    </Text>
                    <Text color="white" fontSize="$3" opacity={0.9}>
                        {title}
                    </Text>
                </YStack>
            </LinearGradient>
        </Pressable>
    );
}
