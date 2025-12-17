import { config as defaultConfig } from "@tamagui/config/v3";
import { createTamagui, createTokens } from "@tamagui/core";

/**
 * Tamagui Configuration
 *
 * Tamagui is a universal UI kit for React Native and Web.
 * It provides:
 * - Cross-platform components (works on iOS, Android, and Web)
 * - Built-in theming system
 * - Optimized performance
 * - TypeScript support
 *
 * This configuration extends the default Tamagui config with custom themes and colors.
 */

/**
 * Custom Color Tokens
 *
 * Define custom colors for your app.
 * These colors are used in both light and dark themes.
 */
const customColors = {
  // Primary brand colors
  primary50: "#eff6ff",
  primary100: "#dbeafe",
  primary200: "#bfdbfe",
  primary300: "#93c5fd",
  primary400: "#60a5fa",
  primary500: "#3b82f6",
  primary600: "#2563eb",
  primary700: "#1d4ed8",
  primary800: "#1e40af",
  primary900: "#1e3a8a",

  // Secondary colors
  secondary50: "#f5f3ff",
  secondary100: "#ede9fe",
  secondary200: "#ddd6fe",
  secondary300: "#c4b5fd",
  secondary400: "#a78bfa",
  secondary500: "#8b5cf6",
  secondary600: "#7c3aed",
  secondary700: "#6d28d9",
  secondary800: "#5b21b6",
  secondary900: "#4c1d95",

  // Accent colors
  accent50: "#fdf4ff",
  accent100: "#fae8ff",
  accent200: "#f5d0fe",
  accent300: "#f0abfc",
  accent400: "#e879f9",
  accent500: "#d946ef",
  accent600: "#c026d3",
  accent700: "#a21caf",
  accent800: "#86198f",
  accent900: "#701a75",

  // Success colors
  success50: "#f0fdf4",
  success100: "#dcfce7",
  success200: "#bbf7d0",
  success300: "#86efac",
  success400: "#4ade80",
  success500: "#22c55e",
  success600: "#16a34a",
  success700: "#15803d",
  success800: "#166534",
  success900: "#14532d",

  // Warning colors
  warning50: "#fffbeb",
  warning100: "#fef3c7",
  warning200: "#fde68a",
  warning300: "#fcd34d",
  warning400: "#fbbf24",
  warning500: "#f59e0b",
  warning600: "#d97706",
  warning700: "#b45309",
  warning800: "#92400e",
  warning900: "#78350f",

  // Error colors
  error50: "#fef2f2",
  error100: "#fee2e2",
  error200: "#fecaca",
  error300: "#fca5a5",
  error400: "#f87171",
  error500: "#ef4444",
  error600: "#dc2626",
  error700: "#b91c1c",
  error800: "#991b1b",
  error900: "#7f1d1d",

  // Neutral colors (for backgrounds, text, borders)
  neutral50: "#fafafa",
  neutral100: "#f5f5f5",
  neutral200: "#e5e5e5",
  neutral300: "#d4d4d4",
  neutral400: "#a3a3a3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",

  // Base colors
  white: "#ffffff",
  black: "#000000",
};

/**
 * Create custom tokens
 */
const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...defaultConfig.tokens.color,
    ...customColors,
  },
});

/**
 * Light Theme
 */
const lightTheme = {
  background: customColors.neutral50,
  backgroundHover: customColors.neutral100,
  backgroundPress: customColors.neutral200,
  backgroundFocus: customColors.neutral100,

  color: customColors.neutral900,
  colorHover: customColors.neutral800,
  colorPress: customColors.neutral700,
  colorFocus: customColors.neutral800,

  borderColor: customColors.neutral300,
  borderColorHover: customColors.neutral400,
  borderColorPress: customColors.neutral500,
  borderColorFocus: customColors.primary500,

  placeholderColor: customColors.neutral400,

  // Primary
  primary: customColors.primary600,
  primaryHover: customColors.primary700,
  primaryPress: customColors.primary800,

  // Secondary
  secondary: customColors.secondary600,
  secondaryHover: customColors.secondary700,
  secondaryPress: customColors.secondary800,

  // Accent
  accent: customColors.accent600,
  accentHover: customColors.accent700,
  accentPress: customColors.accent800,

  // Status colors
  success: customColors.success600,
  warning: customColors.warning600,
  error: customColors.error600,

  // Card
  cardBackground: "#ffffff",
  cardBorder: customColors.neutral200,
};

/**
 * Dark Theme
 */
const darkTheme = {
  background: customColors.neutral900,
  backgroundHover: customColors.neutral800,
  backgroundPress: customColors.neutral700,
  backgroundFocus: customColors.neutral800,

  color: customColors.neutral50,
  colorHover: customColors.neutral100,
  colorPress: customColors.neutral200,
  colorFocus: customColors.neutral100,

  borderColor: customColors.neutral700,
  borderColorHover: customColors.neutral600,
  borderColorPress: customColors.neutral500,
  borderColorFocus: customColors.primary500,

  placeholderColor: customColors.neutral500,

  // Primary
  primary: customColors.primary500,
  primaryHover: customColors.primary400,
  primaryPress: customColors.primary300,

  // Secondary
  secondary: customColors.secondary500,
  secondaryHover: customColors.secondary400,
  secondaryPress: customColors.secondary300,

  // Accent
  accent: customColors.accent500,
  accentHover: customColors.accent400,
  accentPress: customColors.accent300,

  // Status colors
  success: customColors.success500,
  warning: customColors.warning500,
  error: customColors.error500,

  // Card
  cardBackground: customColors.neutral800,
  cardBorder: customColors.neutral700,
};

/**
 * Create Tamagui configuration
 */
export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
});

export type TamaguiConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig { }
}

export default tamaguiConfig;
