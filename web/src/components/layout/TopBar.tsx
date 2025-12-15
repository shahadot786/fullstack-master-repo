'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sun, Moon, Menu, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';

interface TopBarProps {
  onMenuClick: () => void;
}

/**
 * TopBar Component
 * Top navigation bar with search, theme toggle, notifications, and profile menu
 */
export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Get current route name from pathname
  const getRouteName = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) return 'Dashboard';
    return segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-topbar-bg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-text-primary" />
          </button>

          {/* Route Path */}
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-text-primary">{getRouteName()}</h2>
            <p className="text-xs text-text-muted">{pathname}</p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Icon (Mobile) */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-text-primary" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-text-primary" />
            ) : (
              <Sun size={20} className="text-text-primary" />
            )}
          </button>

          {/* Notifications */}
          <Dropdown
            trigger={
              <div className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Bell size={20} className="text-text-primary" />
                {/* Notification Badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </div>
            }
            align="right"
          >
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-text-primary">Notifications</h3>
              <p className="text-xs text-text-muted mt-0.5">You have 3 unread messages</p>
            </div>
            <DropdownItem icon={<Bell size={16} />}>
              New todo created
            </DropdownItem>
            <DropdownItem icon={<Bell size={16} />}>
              Profile updated successfully
            </DropdownItem>
            <DropdownItem icon={<Bell size={16} />}>
              Welcome to Fullstack Master!
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem>
              <span className="text-primary font-medium">View all notifications</span>
            </DropdownItem>
          </Dropdown>

          {/* Profile Menu */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
                  <p className="text-xs text-text-muted truncate max-w-[150px]">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            }
            align="right"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="font-semibold text-text-primary">{user?.name || 'User'}</p>
              <p className="text-xs text-text-muted mt-0.5">{user?.email || 'user@example.com'}</p>
            </div>
            <DropdownItem icon={<User size={16} />}>
              Profile
            </DropdownItem>
            <DropdownItem icon={<Settings size={16} />}>
              Settings
            </DropdownItem>
            <DropdownItem icon={<Bell size={16} />}>
              Notifications
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={<LogOut size={16} />} onClick={handleLogout} danger>
              Logout
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
