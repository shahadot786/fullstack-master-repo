import { Platform } from 'react-native';

/**
 * Platform Utilities
 * 
 * This module provides platform-specific utilities and constants.
 * Use these to handle differences between iOS and Android.
 */

/**
 * Check if running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Get platform-specific value
 * 
 * @param ios - Value for iOS
 * @param android - Value for Android
 * @returns Platform-specific value
 */
export const platformSelect = <T,>(ios: T, android: T): T => {
  return Platform.select({ ios, android }) as T;
};

/**
 * Platform-specific constants
 */
export const PLATFORM_CONSTANTS = {
  // Status bar height (approximate, use SafeAreaView for accurate values)
  STATUS_BAR_HEIGHT: platformSelect(44, 0),
  
  // Bottom tab bar height
  TAB_BAR_HEIGHT: platformSelect(83, 56),
  
  // Header height
  HEADER_HEIGHT: platformSelect(44, 56),
  
  // Elevation/shadow (Android uses elevation, iOS uses shadow)
  ELEVATION: isAndroid ? 4 : 0,
  
  // Font family (iOS and Android have different default fonts)
  DEFAULT_FONT: platformSelect('System', 'Roboto'),
} as const;
