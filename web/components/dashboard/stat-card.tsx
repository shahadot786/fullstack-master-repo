"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    gradient: string;
    onClick?: () => void;
}

export function StatCard({ title, value, icon: Icon, gradient, onClick }: StatCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                gradient
            )}
        >
            <div className="flex flex-col gap-2">
                <Icon className="w-8 h-8 text-white" />
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-white/90">{title}</div>
            </div>
        </div>
    );
}
