import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Card Component
 * Reusable card container with optional header and footer
 * Supports hover effects and customizable padding
 */
export function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  header,
  footer,
}: CardProps) {
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Base styles
  const baseStyles = 'bg-card-bg border border-border rounded-lg shadow-sm transition-all duration-200';
  
  // Hover styles
  const hoverStyles = hover ? 'hover:shadow-md hover:border-border-hover cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {/* Header */}
      {header && (
        <div className="px-6 py-4 border-b border-border">
          {header}
        </div>
      )}

      {/* Body */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
