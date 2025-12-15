'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 * Button to toggle between light and dark themes
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-background hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-border"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-text-primary" />
      ) : (
        <Sun size={20} className="text-text-primary" />
      )}
    </button>
  );
}
