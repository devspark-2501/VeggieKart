"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, LogOut, PlusCircle, Trash2, Package, ClipboardList, Sparkles, CheckCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // "products" or "orders"

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock_kg: "",
    special: false,
  });
  const [submitting, setSubmitting] = useState(false);

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
    fetchSellerData(parsed.email);
  }, [router]);

  const fetchSellerData = async (email) => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/products/seller/${encodeURIComponent(email)}`),
        fetch(`${API_BASE_URL}/api/v1/orders/seller/${encodeURIComponent(email)}`),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (err) {
      console.error("Error fetching seller data:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!seller) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock_kg: parseFloat(newProduct.stock_kg),
          special: newProduct.special,
          vendor_email: seller.email,
          vendor_name: seller.name,
          shop_name: seller.shopName || seller.name,
          upi_id: seller.upiId || "",
          phone: seller.phone || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [...prev, data.product]);
        setNewProduct({ name: "", price: "", stock_kg: "", special: false });
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/orders/${orderId}/status?status=${encodeURIComponent(newStatus)}`,
        { method: "PATCH" }
      );
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("veggiekart_user");
    router.push("/");
  };

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Seller Header */}
        <header className="flex flex-wrap justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-amber-200 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-xl text-gray-950 shadow-sm">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {seller.shopName || "Seller Admin Dashboard"}
              </h1>
              <p className="text-xs text-gray-500">
                Vendor: <span className="font-semibold text-amber-700">{seller.name}</span> • UPI:{" "}
                <span className="font-mono font-semibold text-emerald-700">{seller.upiId || "Not set"}</span>
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

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-emerald-950 text-amber-400 shadow"
                : "bg-white text-gray-600 border border-emerald-100 hover:bg-emerald-50"
            }`}
          >
            <Package className="w-4 h-4" />
            My Listed Veggies ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-emerald-950 text-amber-400 shadow"
                : "bg-white text-gray-600 border border-emerald-100 hover:bg-emerald-50"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Orders Received ({orders.length})
          </button>
        </div>

        {/* TAB 1: MANAGE LISTED PRODUCTS */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Vegetable Form */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 h-fit">
              <h2 className="text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                List New Vegetable
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Vegetable Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Fresh Organic Tomatoes"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                      Price (₹ / kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="40"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                      Available Stock (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newProduct.stock_kg}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_kg: e.target.value })}
                      placeholder="25"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newProduct.special}
                    onChange={(e) => setNewProduct({ ...newProduct, special: e.target.checked })}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  Mark as Today's Special
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
                >
                  {submitting ? "Adding..." : "Publish to Marketplace"}
                </button>
              </form>
            </div>

            {/* Seller's Own Listed Inventory */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
              <h2 className="text-base font-extrabold text-gray-800 mb-4">Your Active Stall Listings</h2>

              {products.length === 0 ? (
                <div className="text-center py-10 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
                  <p className="text-xs font-semibold text-gray-600">
                    You haven't listed any vegetables yet.
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Use the form on the left to add your first harvest item!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                          {item.special && (
                            <span className="bg-amber-400 text-gray-950 text-[9px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> Special
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-emerald-700 mt-1">
                          ₹{item.price} / kg
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Stock available: {item.stock_kg} kg
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        title="Remove Listing"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING ORDERS RECEIVED */}
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
            <h2 className="text-base font-extrabold text-gray-800 mb-4">Customer Orders Received</h2>

            {orders.length === 0 ? (
              <div className="text-center py-10 bg-amber-50/40 rounded-xl border border-dashed border-amber-200">
                <p className="text-xs font-semibold text-gray-600">No customer orders yet.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  When consumers buy your vegetables, their orders will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 flex flex-wrap justify-between items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          Buyer: {order.consumer_name}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-200 text-amber-950"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Payment: <span className="uppercase font-bold">{order.payment_method}</span> • Delivery:{" "}
                        <span className="capitalize">{order.delivery_zone}</span> (+₹{order.delivery_fee})
                      </p>

                      <ul className="mt-2 space-y-1 text-xs text-gray-700">
                        {order.seller_items.map((item, idx) => (
                          <li key={idx}>
                            • <span className="font-semibold">{item.name}</span> — {item.qty} kg × ₹{item.price} ={" "}
                            <span className="font-bold text-emerald-700">₹{item.qty * item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status !== "Delivered" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}