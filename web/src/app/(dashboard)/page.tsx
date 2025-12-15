'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
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
  ArrowRight,
} from 'lucide-react';

// Service configuration
const services = [
  { name: 'Todo', path: '/dashboard/todo', icon: CheckSquare, implemented: true, description: 'Manage your tasks and todos', color: 'bg-blue-500' },
  { name: 'Notes', path: '/dashboard/notes', icon: FileText, implemented: false, description: 'Create and organize notes', color: 'bg-purple-500' },
  { name: 'Chat', path: '/dashboard/chat', icon: MessageSquare, implemented: false, description: 'Real-time messaging', color: 'bg-green-500' },
  { name: 'Shop', path: '/dashboard/shop', icon: ShoppingBag, implemented: false, description: 'E-commerce platform', color: 'bg-pink-500' },
  { name: 'Delivery', path: '/dashboard/delivery', icon: Truck, implemented: false, description: 'Delivery management', color: 'bg-orange-500' },
  { name: 'Expense', path: '/dashboard/expense', icon: DollarSign, implemented: false, description: 'Track your expenses', color: 'bg-yellow-500' },
  { name: 'Social', path: '/dashboard/social', icon: Users, implemented: false, description: 'Social networking features', color: 'bg-indigo-500' },
  { name: 'URL Shortener', path: '/dashboard/urlshort', icon: LinkIcon, implemented: false, description: 'Shorten and manage URLs', color: 'bg-teal-500' },
  { name: 'Weather', path: '/dashboard/weather', icon: Cloud, implemented: false, description: 'Weather forecasts', color: 'bg-cyan-500' },
  { name: 'AI QA', path: '/dashboard/aiqa', icon: Brain, implemented: false, description: 'AI-powered Q&A', color: 'bg-red-500' },
];

/**
 * Dashboard Home Page
 * Overview page showing all available services
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-text-secondary mt-2">
          Here's an overview of all available services in your fullstack application.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Services</p>
              <p className="text-3xl font-bold mt-1">{services.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain size={24} />
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Services</p>
              <p className="text-3xl font-bold mt-1">{services.filter(s => s.implemented).length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckSquare size={24} />
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Coming Soon</p>
              <p className="text-3xl font-bold mt-1">{services.filter(s => !s.implemented).length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Cloud size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">All Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            
            return (
              <Link key={service.path} href={service.path}>
                <Card hover padding="md" className="h-full transition-all duration-200 group">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white`}>
                        <Icon size={24} />
                      </div>
                      {service.implemented ? (
                        <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-sm text-text-secondary mb-4 flex-1">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>{service.implemented ? 'Open' : 'Learn more'}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
