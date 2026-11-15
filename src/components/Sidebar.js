"use client";

import { Home, Search, Sparkles, ClipboardList, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar({ activeTab = "home", setActiveTab }) {
  const router = useRouter();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "special", label: "Today's Special", icon: Sparkles },
    { id: "orders", label: "Checklist / Orders", icon: ClipboardList },
  ];

  const handleLogout = () => {
    localStorage.removeItem("veggiekart_user");
    router.push("/");
  };

  return (
    <aside className="my-auto ml-6 flex flex-col items-center py-5 px-3 bg-white rounded-full shadow-2xl border border-emerald-100 sticky top-6 h-fit">
      <nav className="flex flex-col items-center gap-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab && setActiveTab(item.id)}
              title={item.label}
              className={`p-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer relative group ${
                isActive
                  ? "bg-emerald-950 text-amber-400 shadow-lg scale-105"
                  : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip on hover */}
              <span className="absolute left-16 bg-emerald-950 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-50">
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="w-6 h-[1px] bg-gray-200 my-0.5" />

        {/* Logout / Back to Login */}
        <button
          type="button"
          onClick={handleLogout}
          title="Exit / Login"
          className="p-3 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center cursor-pointer relative group"
        >
          <LogOut className="w-4 h-4" />
          <span className="absolute left-16 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-50">
            Switch Account / Login
          </span>
        </button>
      </nav>
    </aside>
  );
}