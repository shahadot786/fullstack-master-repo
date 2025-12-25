"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LoaderModal } from "@/components/ui/loader-modal";
import { needsTokenRefresh } from "@/lib/utils/token.util";
import { authApi } from "@/lib/api/auth";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    // Only redirect after hydration is complete to avoid false redirects
    if (hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Proactively refresh token if it's about to expire (silently in background)
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!hasHydrated || !isAuthenticated) {
        return;
      }

      // Check if token needs refresh (expires within 8 minutes)
      if (needsTokenRefresh()) {
        try {
          // Refresh silently in the background
          await authApi.refreshToken();
        } catch (error) {
          // If refresh fails, let the user continue
          // The 401 interceptor will handle it on next API call
        }
      }
    };

    checkAndRefreshToken();
  }, [hasHydrated, isAuthenticated]);

  // Show loading while hydrating OR not authenticated
  if (!hasHydrated || !isAuthenticated) {
    return <LoaderModal text="Loading..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
