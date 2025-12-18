"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useStats } from '@/hooks/useStats';
import { StatCard } from '@/components/dashboard/stat-card';
import { ServiceStats } from '@/components/dashboard/service-stats';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LoaderModal } from "@/components/ui/loader-modal";
import { useState } from "react";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Brain,
  ShoppingBag,
  Users,
  Truck,
  Wallet,
  Cloud,
  Link as LinkIcon,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useStats();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return <LoaderModal text="Redirecting to login..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Here's an overview of your services
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Todos"
                    value={stats?.todos.total || 0}
                    icon={CheckSquare}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    onClick={() => router.push('/todos')}
                  />
                  <StatCard
                    title="Active Tasks"
                    value={stats?.todos.active || 0}
                    icon={Clock}
                    gradient="bg-gradient-to-br from-amber-500 to-amber-600"
                  />
                  <StatCard
                    title="Completed"
                    value={stats?.todos.completed || 0}
                    icon={CheckCircle2}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                  />
                  <StatCard
                    title="High Priority"
                    value={stats?.todos.highPriority || 0}
                    icon={AlertCircle}
                    gradient="bg-gradient-to-br from-red-500 to-red-600"
                  />
                </div>
              </div>

              {/* All Services */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  All Services
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <ServiceStats
                    title="Todos"
                    icon={CheckSquare}
                    iconColor="#3b82f6"
                    href="/todos"
                    stats={[
                      { label: 'Total', value: stats?.todos.total || 0 },
                      { label: 'Active', value: stats?.todos.active || 0 },
                      { label: 'Completed', value: stats?.todos.completed || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="Notes"
                    icon={FileText}
                    iconColor="#f59e0b"
                    href="/notes"
                    stats={[
                      { label: 'Total', value: stats?.notes.total || 0 },
                      { label: 'Categories', value: stats?.notes.categories || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="Chat"
                    icon={MessageSquare}
                    iconColor="#8b5cf6"
                    href="/chat"
                    stats={[
                      { label: 'Conversations', value: stats?.chat.totalConversations || 0 },
                      { label: 'Unread', value: stats?.chat.unreadMessages || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="AI Q&A"
                    icon={Brain}
                    iconColor="#ec4899"
                    href="/aiqa"
                    stats={[
                      { label: 'Queries', value: stats?.ai.totalQueries || 0 },
                      { label: 'Tokens', value: stats?.ai.tokensUsed || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="Shop"
                    icon={ShoppingBag}
                    iconColor="#10b981"
                    href="/shop"
                    stats={[
                      { label: 'Products', value: stats?.shop.totalProducts || 0 },
                      { label: 'Orders', value: stats?.shop.totalOrders || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="Social"
                    icon={Users}
                    iconColor="#06b6d4"
                    href="/social"
                    stats={[
                      { label: 'Posts', value: stats?.social.totalPosts || 0 },
                      { label: 'Followers', value: stats?.social.followers || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="Delivery"
                    icon={Truck}
                    iconColor="#f97316"
                    href="/delivery"
                    stats={[
                      { label: 'Active', value: stats?.delivery.activeDeliveries || 0 },
                      { label: 'Completed', value: stats?.delivery.completedDeliveries || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="Expense Tracker"
                    icon={Wallet}
                    iconColor="#84cc16"
                    href="/expense"
                    stats={[
                      { label: 'Total', value: `$${stats?.expense.totalExpenses || 0}` },
                      { label: 'This Month', value: `$${stats?.expense.thisMonth || 0}` },
                    ]}
                  />
                  <ServiceStats
                    title="Weather"
                    icon={Cloud}
                    iconColor="#0ea5e9"
                    href="/weather"
                    stats={[
                      { label: 'Location', value: stats?.weather.currentLocation || 'Not set' },
                      { label: 'Saved', value: stats?.weather.savedLocations || 0 },
                    ]}
                  />
                  <ServiceStats
                    title="URL Shortener"
                    icon={LinkIcon}
                    iconColor="#6366f1"
                    href="/urlshort"
                    stats={[
                      { label: 'URLs', value: stats?.urlShortener.totalUrls || 0 },
                      { label: 'Clicks', value: stats?.urlShortener.totalClicks || 0 },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
