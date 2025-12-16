import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { useAppStore } from '@store/appStore';
import { useTheme } from '@hooks/useTheme';
import Button from '@components/common/Button';

const { width } = Dimensions.get('window');

/**
 * Onboarding slides data
 */
const slides = [
  {
    id: '1',
    title: 'Welcome to Nexus',
    description: 'Your all-in-one productivity app for managing tasks, notes, and more',
    emoji: '👋',
  },
  {
    id: '2',
    title: 'Stay Organized',
    description: 'Keep track of your todos with priorities, due dates, and categories',
    emoji: '✅',
  },
  {
    id: '3',
    title: 'Sync Everywhere',
    description: 'Access your data from any device with seamless cloud synchronization',
    emoji: '☁️',
  },
];

/**
 * Onboarding Screen
 * 
 * Shown to first-time users to introduce the app.
 * After completion, sets onboardingCompleted flag in storage.
 */
export default function OnboardingScreen() {
  const { completeOnboarding } = useAppStore();
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.title, isDark && styles.title_dark]}>{item.title}</Text>
      <Text style={[styles.description, isDark && styles.description_dark]}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.container_dark]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dot_active,
            ]}
          />
        ))}
      </View>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        
        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container_dark: {
    backgroundColor: '#171717',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'JetBrainsMono-Bold',
  },
  title_dark: {
    color: '#f5f5f5',
  },
  description: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'JetBrainsMono-Regular',
  },
  description_dark: {
    color: '#a3a3a3',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4d4d4',
    marginHorizontal: 4,
  },
  dot_active: {
    backgroundColor: '#2563eb',
    width: 24,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: '#737373',
    fontSize: 16,
    fontFamily: 'JetBrainsMono-Medium',
  },
});
