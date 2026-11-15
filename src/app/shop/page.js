"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Search, ShoppingBag, Sparkles, User } from "lucide-react";

const SAMPLE_VEGGIES = [
  { id: 1, name: "Organic Tomatoes", vendor: "Green Valley Stall", price: 40, special: true },
  { id: 2, name: "Farm Fresh Potatoes", vendor: "Kisan Mandi Hub", price: 25, special: false },
  { id: 3, name: "Baby Spinach (Palak)", vendor: "Green Valley Stall", price: 30, special: true },
  { id: 4, name: "Red Onions", vendor: "Bhopal Fresh Farm", price: 35, special: false },
  { id: 5, name: "Green Capsicum", vendor: "Organic Roots", price: 60, special: true },
  { id: 6, name: "Fresh Coriander", vendor: "Kisan Mandi Hub", price: 15, special: false },
];

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("veggiekart_user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser({ name: "Guest Shopper", role: "consumer", isGuest: true });
    }
  }, []);

  const filteredVeggies = SAMPLE_VEGGIES.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "special") return item.special && matchesSearch;
    return matchesSearch;
  });

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex">
      {/* Left Floating Capsule Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                🥬 Farm Fresh <span className="text-emerald-600">Marketplace</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Browse vegetables directly from local sellers and vendors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Cart Badge */}
              <button
                onClick={() => setActiveTab("orders")}
                className="bg-amber-400 hover:bg-amber-500 text-gray-950 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart ({cart.length})
              </button>

              {/* User Profile Pill */}
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user ? user.name : "Loading..."}</span>
                {user?.isGuest && (
                  <button
                    onClick={() => router.push("/")}
                    className="ml-1 text-amber-600 underline font-bold cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Search Bar (Visible on Home & Search tabs) */}
          {(activeTab === "search" || activeTab === "home") && (
            <div className="mb-6 relative max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tomatoes, spinach, potatoes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-emerald-100 shadow-sm text-xs text-gray-800 focus:border-emerald-500 outline-none"
              />
            </div>
          )}

          {/* Checklist / Cart View */}
          {activeTab === "orders" ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Your Veggie Checklist</h2>
              {cart.length === 0 ? (
                <p className="text-xs text-gray-500">Your basket is empty. Add fresh veggies from Home!</p>
              ) : (
                <ul className="space-y-2">
                  {cart.map((c, idx) => (
                    <li key={idx} className="flex justify-between text-xs py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-800">{c.name}</span>
                      <span className="font-bold text-emerald-700">₹{c.price} / kg</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Vegetable Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVeggies.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 bg-emerald-100/80 rounded-xl mb-4 flex items-center justify-center text-emerald-800 text-xs font-bold uppercase tracking-wider relative">
                      {item.special && (
                        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-gray-950 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-extrabold">
                          <Sparkles className="w-3 h-3" /> Special
                        </span>
                      )}
                      {item.name}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Sold by: {item.vendor}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm font-extrabold text-emerald-700">₹{item.price} / kg</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}