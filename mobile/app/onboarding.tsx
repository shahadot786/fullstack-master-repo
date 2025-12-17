import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Dimensions, StyleSheet, FlatList } from 'react-native';
import { YStack, Text, H1, Button as TamaguiButton } from 'tamagui';
import { Button } from '@/components/common/Button';
import { useAppStore } from '@/store/appStore';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to Nexus',
        description: 'Your all-in-one productivity companion for managing tasks and notes',
    },
    {
        id: '2',
        title: 'Manage Your Tasks',
        description: 'Create, organize, and track your todos with priorities and due dates',
    },
    {
        id: '3',
        title: 'Stay Organized',
        description: 'Keep your notes and tasks synced across all your devices',
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
                <View style={styles.placeholder} />
                <H1 color="$color" textAlign="center">
                    {item.title}
                </H1>
                <Text color="$color" opacity={0.7} textAlign="center" fontSize="$5">
                    {item.description}
                </Text>
            </YStack>
        </View>
    );

    return (
        <View style={styles.container}>
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

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <YStack gap="$3" width="100%" paddingHorizontal="$6" paddingBottom="$6">
                    {currentIndex < slides.length - 1 ? (
                        <>
                            <Button title="Next" onPress={handleNext} fullWidth />
                            <TamaguiButton
                                onPress={handleSkip}
                                variant="outlined"
                                backgroundColor="transparent"
                                borderWidth={0}
                            >
                                <Text color="$primary">Skip</Text>
                            </TamaguiButton>
                        </>
                    ) : (
                        <Button title="Get Started" onPress={handleGetStarted} fullWidth />
                    )}
                </YStack>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        width,
        flex: 1,
    },
    placeholder: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#e0e0e0',
    },
    footer: {
        paddingTop: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#3b82f6',
    },
});
