'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CheckSquare,
  FileText,
  MessageSquare,
  ShoppingBag,
  Truck,
  DollarSign,
  Users,
  Link as LinkIcon,
  Cloud,
  Brain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Service configuration
interface Service {
  name: string;
  path: string;
  icon: React.ReactNode;
  implemented: boolean;
  category: string;
}

const services: Service[] = [
  { name: 'Todo', path: '/dashboard/todo', icon: <CheckSquare size={20} />, implemented: true, category: 'Core' },
  { name: 'Notes', path: '/dashboard/notes', icon: <FileText size={20} />, implemented: false, category: 'Core' },
  { name: 'Chat', path: '/dashboard/chat', icon: <MessageSquare size={20} />, implemented: false, category: 'Core' },
  { name: 'Shop', path: '/dashboard/shop', icon: <ShoppingBag size={20} />, implemented: false, category: 'E-commerce' },
  { name: 'Delivery', path: '/dashboard/delivery', icon: <Truck size={20} />, implemented: false, category: 'E-commerce' },
  { name: 'Expense', path: '/dashboard/expense', icon: <DollarSign size={20} />, implemented: false, category: 'Finance' },
  { name: 'Social', path: '/dashboard/social', icon: <Users size={20} />, implemented: false, category: 'Social' },
  { name: 'URL Short', path: '/dashboard/urlshort', icon: <LinkIcon size={20} />, implemented: false, category: 'Utilities' },
  { name: 'Weather', path: '/dashboard/weather', icon: <Cloud size={20} />, implemented: false, category: 'Utilities' },
  { name: 'AI QA', path: '/dashboard/aiqa', icon: <Brain size={20} />, implemented: false, category: 'AI' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sidebar Component
 * Navigation sidebar with all backend services
 * Supports collapse/expand and highlights active route
 */
export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-sidebar-bg border-r border-border z-30 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-64' : 'lg:w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="font-bold text-text-primary text-lg">Fullstack</h1>
                <p className="text-xs text-text-muted">Master Repo</p>
              </div>
            </div>
            
            {/* Collapse Button (Desktop) */}
            <button
              onClick={onToggle}
              className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label="Toggle sidebar"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Dashboard Home */}
            <div>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-primary'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
            </div>

            {/* Services by Category */}
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">
                  {category}
                </h3>
                <div className="space-y-1">
                  {categoryServices.map((service) => {
                    const isActive = pathname === service.path;
                    
                    return (
                      <Link
                        key={service.path}
                        href={service.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-primary'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : 'text-text-muted group-hover:text-text-primary'}>
                          {service.icon}
                        </span>
                        <span className="font-medium flex-1">{service.name}</span>
                        {!service.implemented && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-text-muted text-center">
              <p>v1.0.0</p>
              <p className="mt-1">© 2025 Fullstack Master</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
