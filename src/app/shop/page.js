import Sidebar from "@/components/Sidebar";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                🥬 Farm Fresh <span className="text-emerald-600">Marketplace</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Browse vegetables directly from local sellers and vendors.
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-emerald-100 text-xs font-semibold text-emerald-800">
              Browsing as Guest / Consumer
            </div>
          </header>

          {/* Placeholder Grid for Vegetables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-emerald-100 rounded-xl mb-4 flex items-center justify-center text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    Fresh Vegetable #{item}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">Organic Tomatoes</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Sold by: Green Valley Stall</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-extrabold text-emerald-700">₹40 / kg</span>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}