"use client";

import { useState } from "react";
import { Home, Search, Sparkles, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/shop" },
    { id: "search", label: "Search", icon: Search, href: "/shop" },
    { id: "special", label: "Today's Special", icon: Sparkles, href: "/shop" },
    { id: "orders", label: "Checklist / Orders", icon: ClipboardList, href: "/shop" },
  ];

  return (
    <aside className="w-20 bg-emerald-950 flex flex-col items-center py-6 justify-between rounded-r-3xl shadow-xl h-screen sticky top-0 border-r border-emerald-900">
      {/* Brand Logo Mini */}
      <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-md mb-8">
        <Sparkles className="w-5 h-5 text-amber-300" />
      </div>

      {/* 4 Navigation Icons */}
      <nav className="flex flex-col gap-6 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`flex items-center justify-center p-3.5 rounded-2xl transition-all group relative cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-gray-950 shadow-lg font-bold"
                  : "text-emerald-300 hover:bg-emerald-900 hover:text-amber-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip on hover */}
              <span className="absolute left-20 bg-emerald-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom status dot */}
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
    </aside>
  );
}