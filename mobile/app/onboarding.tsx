import React, { useState, useRef } from 'react';
import { useRouter, Href } from 'expo-router';
import { View, Dimensions, StyleSheet, FlatList, Image } from 'react-native';
import { YStack, XStack, Text, H1, Button as TamaguiButton } from 'tamagui';
import { Button } from '@/components/common/Button';
import { useAppStore } from '@/store/appStore';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to Nexus',
        description: 'Your all-in-one productivity companion for managing tasks and notes',
        image: require('../assets/images/onboarding_welcome.png'),
    },
    {
        id: '2',
        title: 'Manage Your Tasks',
        description: 'Create, organize, and track your todos with priorities and due dates',
        image: require('../assets/images/onboarding_tasks.png'),
    },
    {
        id: '3',
        title: 'Stay Organized',
        description: 'Keep your notes and tasks synced across all your devices',
        image: require('../assets/images/onboarding_sync.png'),
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const completeOnboarding = useAppStore((state) => state.completeOnboarding);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const handleSkip = () => {
        handleGetStarted();
    };

    const handleGetStarted = () => {
        completeOnboarding();
        router.replace('/(auth)/login' as Href);
    };

    const renderItem = ({ item }: { item: typeof slides[0] }) => (
        <View style={styles.slide}>
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$6">
                <Image
                    source={require('../assets/images/logo.png')}
                    style={{ width: 60, height: 60, marginBottom: 8 }}
                    resizeMode="contain"
                />
                <View style={styles.imageContainer}>
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                <YStack gap="$4" alignItems="center" maxWidth={340}>
                    <H1 color="$color" textAlign="center" fontSize="$9" fontWeight="700">
                        {item.title}
                    </H1>
                    <Text
                        color="$color"
                        opacity={0.75}
                        textAlign="center"
                        fontSize="$5"
                        lineHeight="$6"
                    >
                        {item.description}
                    </Text>
                </YStack>
            </YStack>
        </View>
    );

    return (
        <YStack flex={1} backgroundColor="$background">
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
            />

            <YStack paddingBottom="$8" paddingTop="$6" backgroundColor="$background">
                <XStack justifyContent="center" alignItems="center" marginBottom="$6" gap="$2">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    width: index === currentIndex ? 32 : 8,
                                    opacity: index === currentIndex ? 1 : 0.3,
                                },
                            ]}
                        />
                    ))}
                </XStack>

                <YStack gap="$3" paddingHorizontal="$6">
                    {currentIndex < slides.length - 1 ? (
                        <>
                            <Button title="Next" onPress={handleNext} fullWidth />
                            <TamaguiButton
                                onPress={handleSkip}
                                backgroundColor="transparent"
                                borderWidth={0}
                                pressStyle={{ opacity: 0.7 }}
                            >
                                <Text color="$primary" fontSize="$5" fontWeight="600">
                                    Skip
                                </Text>
                            </TamaguiButton>
                        </>
                    ) : (
                        <Button title="Get Started" onPress={handleGetStarted} fullWidth />
                    )}
                </YStack>
            </YStack>
        </YStack>
    );
}

const styles = StyleSheet.create({
    slide: {
        width,
        flex: 1,
    },
    imageContainer: {
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
    },
});
