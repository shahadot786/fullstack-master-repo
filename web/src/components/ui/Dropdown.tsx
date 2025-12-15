import React, { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * Dropdown Component
 * Reusable dropdown menu with click-outside detection
 * Supports keyboard navigation and auto-positioning
 */
export function Dropdown({
  trigger,
  children,
  align = 'right',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Alignment classes
  const alignmentClasses = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${alignmentClasses} mt-2 w-56 bg-card-bg border border-border rounded-lg shadow-lg z-50 animate-slideDown ${className}`}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * DropdownItem Component
 * Individual item within dropdown menu
 */
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger = false,
  disabled = false,
}: DropdownItemProps) {
  const baseStyles = 'flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer';
  const colorStyles = danger
    ? 'text-error hover:bg-red-50 dark:hover:bg-red-900/20'
    : 'text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${colorStyles} ${disabledStyles}`}
    >
      {icon && <span className="text-text-muted">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

/**
 * DropdownDivider Component
 * Visual separator between dropdown items
 */
export function DropdownDivider() {
  return <div className="my-1 border-t border-border" />;
}

// Add slide down animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.2s ease-out;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('dropdown-animations')) {
  style.id = 'dropdown-animations';
  document.head.appendChild(style);
}
