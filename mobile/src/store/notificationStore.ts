import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { ChatUser } from '@/types';

/**
 * In-App Notification Store
 * 
 * Manages foreground notifications when new messages arrive.
 * Shows toast/banner notifications with vibration feedback.
 */

export interface InAppNotification {
  id: string;
  type: 'chat' | 'shoutbox';
  title: string;
  message: string;
  senderName: string;
  senderImage?: string;
  conversationId?: string;
  timestamp: Date;
}

interface NotificationState {
  currentNotification: InAppNotification | null;
  isVisible: boolean;
  // The conversation ID the user is currently viewing (to suppress notifications)
  activeConversationId: string | null;
  // Whether the user is on the shoutbox screen
  isInShoutbox: boolean;
}

interface NotificationActions {
  showNotification: (notification: Omit<InAppNotification, 'id' | 'timestamp'>) => void;
  hideNotification: () => void;
  setActiveConversation: (conversationId: string | null) => void;
  setIsInShoutbox: (isInShoutbox: boolean) => void;
}

type NotificationStore = NotificationState & NotificationActions;

let notificationTimeout: ReturnType<typeof setTimeout> | null = null;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  currentNotification: null,
  isVisible: false,
  activeConversationId: null,
  isInShoutbox: false,

  showNotification: (notification) => {
    const state = get();
    
    // Don't show notification if user is viewing the same conversation
    if (notification.type === 'chat' && notification.conversationId === state.activeConversationId) {
      return;
    }
    
    // Don't show shoutbox notification if user is in shoutbox
    if (notification.type === 'shoutbox' && state.isInShoutbox) {
      return;
    }

    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newNotification: InAppNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // Clear any existing timeout
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    set({ currentNotification: newNotification, isVisible: true });

    // Auto-hide after 4 seconds
    notificationTimeout = setTimeout(() => {
      set({ isVisible: false });
      // Clear notification after animation
      setTimeout(() => {
        set({ currentNotification: null });
      }, 300);
    }, 4000);
  },

  hideNotification: () => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
      notificationTimeout = null;
    }
    set({ isVisible: false });
    setTimeout(() => {
      set({ currentNotification: null });
    }, 300);
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  setIsInShoutbox: (isInShoutbox) => {
    set({ isInShoutbox });
  },
}));
