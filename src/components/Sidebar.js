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
    <aside className="my-auto ml-6 flex flex-col items-center py-5 px-3 bg-white rounded-full shadow-2xl border border-emerald-100 sticky top-6 h-fit">
      <nav className="flex flex-col items-center gap-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`p-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer relative group ${
                isActive
                  ? "bg-emerald-950 text-amber-400 shadow-lg scale-105"
                  : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip on hover */}
              <span className="absolute left-16 bg-emerald-950 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}