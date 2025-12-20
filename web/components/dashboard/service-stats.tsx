"use client";

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ServiceStatsProps {
    title: string;
    icon: LucideIcon;
    stats: { label: string; value: number | string }[];
    href: string;
    iconColor: string;
}

export function ServiceStats({ title, icon: Icon, stats, href, iconColor }: ServiceStatsProps) {
    return (
        <Link href={href}>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${iconColor}20` }}
                    >
                        <Icon className="w-6 h-6" style={{ color: iconColor }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                        {title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index}>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
}
