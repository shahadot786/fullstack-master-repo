import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  clearCache: () => void;
  setUser: (user: User) => void;
  setClearCache: (clearFn: () => void) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      clearCache: () => { },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setClearCache: (clearFn) =>
        set({
          clearCache: clearFn,
        }),

      logout: () => {
        // Clear React Query cache before clearing auth state
        const { clearCache } = get();
        clearCache();

        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated when persist finishes loading from localStorage
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
