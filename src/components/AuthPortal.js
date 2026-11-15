"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Store, ShoppingBag, ArrowRight, UserCheck, AlertCircle, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AuthPortal() {
  const router = useRouter();
  const [role, setRole] = useState("consumer");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    location: "",
    upiId: "",
    phone: "",
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
          upiId: role === "seller" ? formData.upiId : null,
          phone: role === "seller" ? formData.phone : null,
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

      const userSession = {
        name: data.name || formData.name,
        email: formData.email,
        role: data.role || role,
        shopName: data.shopName || formData.shopName || null,
        upiId: data.upiId || formData.upiId || null,
        phone: data.phone || formData.phone || null,
        userId: data.user_id || null,
        isGuest: false,
      };
      localStorage.setItem("veggiekart_user", JSON.stringify(userSession));

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
      <div className="flex items-center gap-2 mb-2.5">
        <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md">
          <Leaf className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Veggie<span className="text-emerald-600">Kart</span>
        </h1>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        <div className="bg-emerald-900 text-white p-2.5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1.5">
            Who are you joining as today?
          </p>
          <div className="grid grid-cols-2 gap-2 bg-emerald-950/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setRole("consumer");
                setError("");
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              {role === "seller"
                ? isLogin
                  ? "Vendor Portal Login"
                  : "Register Your Veggie Stall"
                : isLogin
                ? "Welcome Back!"
                : "Create Consumer Account"}
            </h2>
            <p className="text-[11px] text-gray-500">
              {role === "seller"
                ? "Add your stall and payment details to receive direct orders."
                : "Get farm-fresh vegetables delivered directly from local vendors."}
            </p>
          </div>

          {error && (
            <div className="mb-2.5 p-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
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
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-xs text-gray-800"
                />
              </div>
            )}

            {role === "seller" && !isLogin && (
              <>
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
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-xs text-gray-800"
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
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-xs text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                      UPI ID (For Payments)
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      required
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="ramesh@okicici"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-gray-600 mb-0.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-xs text-gray-800"
                    />
                  </div>
                </div>
              </>
            )}

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
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-xs text-gray-800"
              />
            </div>

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
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-xs text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60 ${
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

          <div className="mt-3 text-center text-xs text-gray-600">
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

          {role === "consumer" && (
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleGuestBrowse}
                className="w-full py-1.5 px-3 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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