"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  FileText,
  MessageSquare,
  Brain,
  Truck,
  DollarSign,
  ShoppingBag,
  Users,
  Link as LinkIcon,
  Cloud,
} from "lucide-react";

const services = [
  { name: "Todo", href: "/todos", icon: CheckSquare, active: true },
  { name: "Notes", href: "/notes", icon: FileText, active: false },
  { name: "Chat", href: "/chat", icon: MessageSquare, active: false },
  { name: "AI Q&A", href: "/aiqa", icon: Brain, active: false },
  { name: "Delivery", href: "/delivery", icon: Truck, active: false },
  { name: "Expense", href: "/expense", icon: DollarSign, active: false },
  { name: "Shop", href: "/shop", icon: ShoppingBag, active: false },
  { name: "Social", href: "/social", icon: Users, active: false },
  { name: "URL Shortener", href: "/urlshort", icon: LinkIcon, active: false },
  { name: "Weather", href: "/weather", icon: Cloud, active: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Project Info */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">FM</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Full-Stack Master
            </h1>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          All-in-one service platform
        </p>
      </div>

      {/* Services Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Services
          </p>
          {services.map((service) => {
            const Icon = service.icon;
            const isActive = pathname.startsWith(service.href);

            return (
              <Link
                key={service.name}
                href={service.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                  !service.active && "opacity-60"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{service.name}</span>
                {service.active && (
                  <span className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
