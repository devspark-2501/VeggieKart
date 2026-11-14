"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Store, ShoppingBag, ArrowRight, UserCheck } from "lucide-react";

export default function AuthPortal() {
  const router = useRouter();
  const [role, setRole] = useState("consumer"); // "consumer" or "seller"
  const [isLogin, setIsLogin] = useState(true); // true = Sign In, false = Register

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary frontend routing (we will hook this up to FastAPI + MongoDB next!)
    if (role === "seller") {
      router.push("/admin");
    } else {
      router.push("/shop");
    }
  };

  const handleGuestBrowse = () => {
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-md">
          <Leaf className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Veggie<span className="text-emerald-600">Kart</span>
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        {/* TOP ROLE QUESTION BANNER */}
        <div className="bg-emerald-900 text-white p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-2">
            Who are you joining as today?
          </p>
          <div className="grid grid-cols-2 gap-2 bg-emerald-950/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("consumer")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                role === "consumer"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Consumer
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("seller");
                setIsLogin(false); // Default sellers to Register if new
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                role === "seller"
                  ? "bg-amber-500 text-gray-950 shadow"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              <Store className="w-4 h-4" />
              Seller / Vendor
            </button>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {role === "seller"
                ? isLogin
                  ? "Vendor Portal Login"
                  : "Register Your Veggie Stall"
                : isLogin
                ? "Welcome Back!"
                : "Create Consumer Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {role === "seller"
                ? "Manage your harvest inventory, daily mandi rates, and incoming orders."
                : "Get farm-fresh vegetables delivered directly from local vendors."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Only on Register) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-gray-800"
                />
              </div>
            )}

            {/* Seller Specific Fields */}
            {role === "seller" && !isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Shop / Farm Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    required
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Green Valley Fresh Veggies"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Market / Mandi Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Bittan Market, Bhopal"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-gray-800"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-gray-800"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === "seller"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <UserCheck className="w-5 h-5" />
              {isLogin
                ? `Sign In as ${role === "seller" ? "Vendor" : "Consumer"}`
                : `Register as ${role === "seller" ? "Vendor" : "Consumer"}`}
            </button>
          </form>

          {/* Toggle Sign In / Register */}
          <div className="mt-5 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up Now" : "Sign In"}
            </button>
          </div>

          {/* Guest Browsing Option (Only for Consumers) */}
          {role === "consumer" && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleGuestBrowse}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue Browsing Veggies Without Login
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}