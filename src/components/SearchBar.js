"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, placeholder = "Search fresh vegetables or vendors..." }) {
  return (
    
    <div className="mb-6 relative max-w-md">
      <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-emerald-200 shadow-sm text-xs text-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
      />
      
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
