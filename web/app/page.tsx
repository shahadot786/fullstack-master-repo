"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LoaderModal } from '@/components/ui/loader-modal';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import DashboardPage from './(dashboard)/page';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/stats');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return <LoaderModal text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <LoaderModal text="Redirecting..." />;
  }

  // Show dashboard with sidebar and header for authenticated users
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
