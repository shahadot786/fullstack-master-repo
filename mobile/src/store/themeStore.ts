import { create } from 'zustand';
import { ThemeState, ThemeMode } from '@types';
import { STORAGE_KEYS, getString, setString } from '@utils/storage';
import { THEME } from '@config/constants';

/**
 * Theme Store (Zustand)
 * 
 * Manages the app's theme (light/dark mode).
 * The theme preference is persisted to storage so it's remembered across app restarts.
 * 
 * This store integrates with Tamagui's theme system.
 */

/**
 * Get initial theme from storage or default to light
 */
const getInitialTheme = (): ThemeMode => {
  const savedTheme = getString(STORAGE_KEYS.THEME);
  return (savedTheme as ThemeMode) || THEME.LIGHT;
};

/**
 * Create the theme store
 */
export const useThemeStore = create<ThemeState>((set) => ({
  // Initial state from storage
  mode: getInitialTheme(),

  /**
   * Toggle between light and dark theme
   */
  toggleTheme: () => {
    set((state) => {
      const newMode = state.mode === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      setString(STORAGE_KEYS.THEME, newMode);
      return { mode: newMode };
    });
  },

  /**
   * Set theme to a specific mode
   * 
   * @param mode - Theme mode ('light' or 'dark')
   */
  setTheme: (mode: ThemeMode) => {
    setString(STORAGE_KEYS.THEME, mode);
    set({ mode });
  },
}));
