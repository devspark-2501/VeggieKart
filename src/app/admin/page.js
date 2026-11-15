"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, LogOut, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("veggiekart_user");
    if (!saved) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(saved);
    if (parsed.role !== "seller") {
      router.push("/shop");
      return;
    }
    setSeller(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("veggiekart_user");
    router.push("/");
  };

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-amber-50/40 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-amber-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-xl text-gray-950">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {seller.shopName || "Seller Admin Dashboard"}
              </h1>
              <p className="text-xs text-gray-500">
                Logged in as <span className="font-semibold text-amber-700">{seller.name}</span> ({seller.email})
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Manage Your Harvest Inventory</h2>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
              <PlusCircle className="w-4 h-4" />
              Add New Vegetable
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Your vendor account is verified and stored in MongoDB. Ready to connect product endpoints next!
          </p>
        </div>
      </div>
    </div>
  );
}