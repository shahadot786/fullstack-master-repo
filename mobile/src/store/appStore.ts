import { create } from 'zustand';
import { StorageUtils } from '@/utils/storage';
import { STORAGE_KEYS, THEMES } from '@/config/constants';
import { Theme } from '@/types';

/**
 * App Store
 * 
 * Zustand store for app-level state with MMKV persistence.
 * Manages onboarding status and theme preference.
 */

interface AppState {
    onboardingCompleted: boolean;
    theme: Theme;
}

interface AppActions {
    completeOnboarding: () => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    hydrate: () => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
    // Initial state
    onboardingCompleted: false,
    theme: THEMES.LIGHT,

    // Actions
    completeOnboarding: () => {
        StorageUtils.setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
        set({ onboardingCompleted: true });
    },

    setTheme: (theme) => {
        StorageUtils.setString(STORAGE_KEYS.THEME, theme);
        set({ theme });
    },

    toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        StorageUtils.setString(STORAGE_KEYS.THEME, newTheme);
        set({ theme: newTheme });
    },

    hydrate: () => {
        // Load from storage on app start
        const onboardingCompleted = StorageUtils.getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED) ?? false;
        const theme = (StorageUtils.getString(STORAGE_KEYS.THEME) as Theme) ?? THEMES.LIGHT;

        set({
            onboardingCompleted,
            theme,
        });
    },
}));
