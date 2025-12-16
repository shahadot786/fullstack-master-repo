import { useThemeStore } from '@store/themeStore';

/**
 * Custom Hook: useTheme
 * 
 * This hook provides access to the theme store.
 * Use it to get the current theme and toggle between light/dark modes.
 * 
 * Usage:
 * const { mode, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const store = useThemeStore();
  
  return {
    mode: store.mode,
    toggleTheme: store.toggleTheme,
    setTheme: store.setTheme,
    isDark: store.mode === 'dark',
    isLight: store.mode === 'light',
  };
};
