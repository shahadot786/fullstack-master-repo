import { useAppStore } from '@/store/appStore';

/**
 * useTheme Hook
 * 
 * Custom hook for accessing theme state.
 * Provides current theme and toggle function.
 */

export const useTheme = () => {
    const { theme, setTheme, toggleTheme } = useAppStore();

    return {
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        setTheme,
        toggleTheme,
    };
};
