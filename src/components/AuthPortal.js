"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Store, ShoppingBag, ArrowRight, UserCheck, AlertCircle, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AuthPortal() {
  const router = useRouter();
  const [role, setRole] = useState("consumer"); // "consumer" or "seller"
  const [isLogin, setIsLogin] = useState(true); // true = Sign In, false = Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/signup";
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
          shopName: role === "seller" ? formData.shopName : null,
          location: role === "seller" ? formData.location : null,
        };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed. Please try again.");
      }

      // Save active session to localStorage
      const userSession = {
        name: data.name || formData.name,
        email: formData.email,
        role: data.role || role,
        shopName: data.shopName || formData.shopName || null,
        userId: data.user_id || null,
        isGuest: false,
      };
      localStorage.setItem("veggiekart_user", JSON.stringify(userSession));

      // Route based on confirmed role from backend
      if (userSession.role === "seller") {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    } catch (err) {
      setError(err.message || "Could not connect to server. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestBrowse = () => {
    localStorage.setItem(
      "veggiekart_user",
      JSON.stringify({ name: "Guest Shopper", role: "consumer", isGuest: true })
    );
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex flex-col items-center justify-center p-3">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md">
          <Leaf className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Veggie<span className="text-emerald-600">Kart</span>
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        {/* TOP ROLE QUESTION BANNER */}
        <div className="bg-emerald-900 text-white p-3 text-center">
          <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold mb-1.5">
            Who are you joining as today?
          </p>
          <div className="grid grid-cols-2 gap-2 bg-emerald-950/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setRole("consumer");
                setError("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "consumer"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Consumer
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("seller");
                setIsLogin(false);
                setError("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "seller"
                  ? "bg-amber-500 text-gray-950 shadow"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Seller / Vendor
            </button>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-5 sm:p-6">
          <div className="mb-3">
            <h2 className="text-xl font-bold text-gray-800">
              {role === "seller"
                ? isLogin
                  ? "Vendor Portal Login"
                  : "Register Your Veggie Stall"
                : isLogin
                ? "Welcome Back!"
                : "Create Consumer Account"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {role === "seller"
                ? "Manage your harvest inventory, daily mandi rates, and incoming orders."
                : "Get farm-fresh vegetables delivered directly from local vendors."}
            </p>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Full Name (Only on Register) */}
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs text-gray-800"
                />
              </div>
            )}

            {/* Seller Specific Fields */}
            {role === "seller" && !isLogin && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                    Shop / Farm Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    required
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Green Valley Stall"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                    Mandi Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Bittan Market, Bhopal"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-gray-800"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs text-gray-800"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60 ${
                role === "seller"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  {isLogin
                    ? `Sign In as ${role === "seller" ? "Vendor" : "Consumer"}`
                    : `Register as ${role === "seller" ? "Vendor" : "Consumer"}`}
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign In / Register */}
          <div className="mt-3.5 text-center text-xs text-gray-600">
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up Now" : "Sign In"}
            </button>
          </div>

          {/* Guest Browsing Option (Only for Consumers) */}
          {role === "consumer" && (
            <div className="mt-3.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleGuestBrowse}
                className="w-full py-2 px-3 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Continue Browsing Veggies Without Login
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}