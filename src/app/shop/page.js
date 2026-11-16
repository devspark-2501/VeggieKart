"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import {
  ShoppingBag,
  Sparkles,
  User,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Smartphone,
  Banknote,
  Truck,
  Loader2,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [deliveryZone, setDeliveryZone] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("veggiekart_user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser({ name: "Guest Shopper", role: "consumer", isGuest: true });
    }
    fetchMarketplaceProducts();
  }, []);

  const fetchMarketplaceProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const filteredVeggies = products.filter((item) => {
    const query = searchQuery.toLowerCase();
    const shopLabel = (item.shop_name || item.vendor_name || "").toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) || shopLabel.includes(query);
    if (activeTab === "special") return item.special && matchesSearch;
    return matchesSearch;
  });

  const handleAddToCart = (item) => {
    setOrderPlaced(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const deliveryCharges = {
    nearby: 40,
    standard: 60,
    express: 70,
  };
  const deliveryFee = cart.length > 0 ? deliveryCharges[deliveryZone] : 0;
  const grandTotal = itemsSubtotal + deliveryFee;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);

    try {
      const orderPayload = {
        consumer_name: user?.name || "Guest Shopper",
        consumer_email: user?.email || "Guest",
        items: cart.map((c) => ({
          product_id: c.id,
          name: c.name,
          price: c.price,
          qty: c.qty,
          vendor_email: c.vendor_email,
          vendor_name: c.shop_name || c.vendor_name,
        })),
        subtotal: itemsSubtotal,
        delivery_fee: deliveryFee,
        delivery_zone: deliveryZone,
        grand_total: grandTotal,
        payment_method: paymentMethod,
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        setOrderPlaced(true);
        setCart([]);
      }
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                🥬 Farm Fresh <span className="text-emerald-600">Marketplace</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Live harvest listings directly from local registered vendors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("orders")}
                className="bg-amber-400 hover:bg-amber-500 text-gray-950 px-4 py-2 rounded-2xl shadow-sm text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {totalItems} {totalItems === 1 ? "Item" : "Items"} • ₹{itemsSubtotal}
                </span>
              </button>

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

          {activeTab !== "orders" && (
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}

          {activeTab === "orders" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Your Veggie Checklist</h2>

                {orderPlaced && (
                  <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Order Sent to Vendor!</p>
                      <p>Your order is now visible on the seller's dashboard.</p>
                    </div>
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-500 mb-3">Your basket is currently empty.</p>
                    <button
                      onClick={() => setActiveTab("home")}
                      className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Browse Veggies
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100"
                      >
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-[11px] text-gray-500">
                            Vendor: {item.shop_name || item.vendor_name} • ₹{item.price}/kg
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="text-gray-600 hover:text-emerald-700 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="text-gray-600 hover:text-emerald-700 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-extrabold text-emerald-800 text-sm w-14 text-right">
                            ₹{item.price * item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, -item.qty)}
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 h-fit space-y-5">
                  <h3 className="text-base font-extrabold text-gray-900">Instant Bill & Payment</h3>

                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-gray-600 mb-2">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Select Delivery Distance
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "nearby", label: "Nearby", fee: 40 },
                        { id: "standard", label: "City", fee: 60 },
                        { id: "express", label: "Express", fee: 70 },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setDeliveryZone(tier.id)}
                          className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                            deliveryZone === tier.id
                              ? "bg-emerald-950 text-amber-400 border-emerald-950 font-bold shadow"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50"
                          }`}
                        >
                          <div className="text-[11px]">{tier.label}</div>
                          <div className="text-xs font-extrabold">+₹{tier.fee}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-600 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "upi"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        Pay via UPI
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "cod"
                            ? "bg-amber-500 text-gray-950 border-amber-500 shadow"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        Cash on Delivery
                      </button>
                    </div>

                    {paymentMethod === "upi" ? (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                        <p className="font-bold text-emerald-900">Direct Seller UPI Details:</p>
                        <p className="text-gray-700">
                          UPI ID:{" "}
                          <span className="font-mono font-bold text-emerald-800">
                            {cart[0].upi_id || "Ask vendor on delivery"}
                          </span>
                        </p>
                        <p className="text-gray-700">
                          Mobile No:{" "}
                          <span className="font-mono font-bold text-emerald-800">
                            {cart[0].phone || "Not provided"}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        Pay <span className="font-bold">₹{grandTotal}</span> in cash when your fresh vegetables arrive.
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Veggies Subtotal</span>
                      <span className="font-semibold">₹{itemsSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee ({deliveryZone})</span>
                      <span className="font-semibold text-amber-700">+₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Grand Total</span>
                      <span className="text-emerald-700">₹{grandTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={placingOrder}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    {placingOrder ? "Sending Order..." : `Place Order • ₹${grandTotal}`}
                  </button>
                </div>
              )}
            </div>
          ) : loadingProducts ? (
            <div className="flex items-center justify-center py-16 text-emerald-700 gap-2 text-xs font-bold">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading fresh harvest from local vendors...
            </div>
          ) : filteredVeggies.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-emerald-100 text-center">
              <p className="text-sm font-bold text-gray-800">No vegetables listed yet!</p>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? `No matches found for "${searchQuery}".`
                  : "Register a Seller / Vendor account and publish products to see them appear here live."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVeggies.map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
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
                      <p className="text-xs text-gray-500 mt-0.5">
                        Sold by: {item.shop_name || item.vendor_name}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        In Stock: {item.stock_kg} kg
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm font-extrabold text-emerald-700">₹{item.price} / kg</span>
                      {inCart ? (
                        <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="text-emerald-800 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-extrabold text-emerald-950 px-1">
                            {inCart.qty} kg
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="text-emerald-800 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}