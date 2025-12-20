"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api";
import type { AnalyticsUser, AnalyticsService } from "@repo/shared";
import { Users, Activity, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PublicAnalyticsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", currentPage],
    queryFn: () => getAnalytics(currentPage, limit),
  });

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  const analytics = data?.data;
  const pagination = analytics?.pagination;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Header */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/nexus-logo.png"
                alt="Nexus Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nexus</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Analytics Dashboard</p>
              </div>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              📊 Global Analytics
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real-time insights into our platform activity
            </p>
          </div>

          {/* Global Service Statistics */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Service Statistics
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics?.services.map((service: AnalyticsService) => (
                <div
                  key={service.name}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {service.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total</span>
                      <span className="text-2xl font-bold text-blue-600">{service.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="text-xl font-semibold text-green-600">{service.completed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Pending</span>
                      <span className="text-xl font-semibold text-amber-600">{service.pending}</span>
                    </div>
                  </div>
                  {service.total > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                        <span className="font-semibold text-blue-600">
                          {Math.round((service.completed / service.total) * 100)}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(service.completed / service.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Activity
                </h2>
              </div>
              {pagination && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, pagination.total)} of {pagination.total} users
                </div>
              )}
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {analytics?.users.map((user: AnalyticsUser) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  {/* User Header */}
                  <div className="flex items-center gap-4 mb-4">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* User Services */}
                  <div className="space-y-3">
                    {user.services.map((service: AnalyticsService) => (
                      <div
                        key={service.name}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </span>
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="text-gray-600 dark:text-gray-400">Total</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {service.total}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 dark:text-gray-400">Done</div>
                            <div className="font-semibold text-green-600">
                              {service.completed}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 dark:text-gray-400">Pending</div>
                            <div className="font-semibold text-amber-600">
                              {service.pending}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="font-medium">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
