import { create } from 'zustand';
import { AppState } from '@types';
import { STORAGE_KEYS, getBoolean, setBoolean, getString, setString } from '@utils/storage';

/**
 * App Store (Zustand)
 * 
 * Manages app-level state that doesn't fit into other stores.
 * This includes:
 * - Onboarding completion status
 * - Active drawer navigation item
 * - Other app-wide settings
 */

/**
 * Create the app store
 */
export const useAppStore = create<AppState>((set) => ({
  // Initial state from storage
  onboardingCompleted: getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED) || false,
  activeDrawerItem: getString(STORAGE_KEYS.ACTIVE_TAB) || 'todos',

  /**
   * Mark onboarding as completed
   * 
   * This is called when the user finishes the onboarding flow.
   * Once completed, the user won't see onboarding again.
   */
  completeOnboarding: () => {
    setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
    set({ onboardingCompleted: true });
  },

  /**
   * Set the active drawer item
   * 
   * This determines which feature is currently active (todos, notes, etc.)
   * and which bottom tabs to display.
   * 
   * @param item - Drawer item ID ('todos', 'notes', etc.)
   */
  setActiveDrawerItem: (item: string) => {
    setString(STORAGE_KEYS.ACTIVE_TAB, item);
    set({ activeDrawerItem: item });
  },
}));
