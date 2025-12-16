import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppStore } from '@store/appStore';
import { useTheme } from '@hooks/useTheme';
import Button from '@components/common/Button';

/**
 * Splash Screen
 * 
 * Initial screen shown while app is loading.
 * This is different from the Expo splash screen.
 * Use this for any app initialization logic.
 */
export default function SplashScreen() {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, isDark && styles.container_dark]}>
      <Image
        source={require('@assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.appName, isDark && styles.appName_dark]}>Nexus</Text>
      <Text style={[styles.tagline, isDark && styles.tagline_dark]}>
        Your productivity companion
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container_dark: {
    backgroundColor: '#171717',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    fontFamily: 'JetBrainsMono-Bold',
  },
  appName_dark: {
    color: '#3b82f6',
  },
  tagline: {
    fontSize: 16,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  tagline_dark: {
    color: '#a3a3a3',
  },
});
