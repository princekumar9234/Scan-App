import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Inbox
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import HomeNav from "../Components/Homes/HomeNav";
import ClientServer from "./ClientServer";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounced search / change inputs trigger reload
  useEffect(() => {
    fetchHistory();
  }, [filter, sort, page]);

  const fetchHistory = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await ClientServer.get("/api/history", {
        params: { search, filter, sort, page, limit: 6 }
      });
      if (res.data && res.data.success) {
        setHistory(res.data.data.history);
        setTotalPages(res.data.data.pagination.totalPages);
        setTotalCount(res.data.data.pagination.total);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load scan history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scan from your history?")) return;
    try {
      const res = await ClientServer.delete(`/api/history/${id}`);
      if (res.data && res.data.success) {
        toast.success("Scan record deleted.");
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("WARNING: This will permanently delete your entire scan history. Proceed?")) return;
    try {
      const res = await ClientServer.delete("/api/history");
      if (res.data && res.data.success) {
        toast.success("History cleared successfully!");
        setPage(1);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear history");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-12">
      <Toaster position="top-center" />
      <HomeNav />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* Header Title & Clear All */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 font-mono">
              Saved Logs
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Scan History</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="bg-red-950/40 border border-red-500/30 text-red-400 font-bold py-2.5 px-5 rounded-xl hover:bg-red-900/60 hover:text-red-300 transition cursor-pointer text-sm flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All History
            </button>
          )}
        </div>

        {/* Search, Filter, & Sort Controls */}
        <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-4 shadow-[0_8px_20px_rgba(0,0,0,0.6)] mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search product name, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black p-3 pr-10 rounded-xl border border-neutral-800 focus:border-emerald-400 outline-none text-sm text-gray-200 transition focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)]"
            />
            <button type="submit" className="absolute right-3 top-3.5 text-neutral-500 hover:text-emerald-400 cursor-pointer">
              <Search size={16} />
            </button>
          </form>

          {/* Filters & Sort */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
            
            {/* Filter by status */}
            <div className="flex items-center bg-black border border-neutral-800 rounded-xl px-2">
              <Filter size={14} className="text-neutral-500 ml-1" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-neutral-300 p-2.5 outline-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900">All Products</option>
                <option value="Healthy" className="bg-neutral-900 text-emerald-400">Healthy Only</option>
                <option value="Moderate" className="bg-neutral-900 text-amber-500">Moderate Only</option>
                <option value="Unhealthy" className="bg-neutral-900 text-red-500">Unhealthy Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center bg-black border border-neutral-800 rounded-xl px-2">
              <ArrowUpDown size={14} className="text-neutral-500 ml-1" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-neutral-300 p-2.5 outline-none cursor-pointer"
              >
                <option value="desc" className="bg-neutral-900">Newest Scan</option>
                <option value="asc" className="bg-neutral-900">Oldest Scan</option>
                <option value="name" className="bg-neutral-900">Product Name</option>
              </select>
            </div>

          </div>
        </div>

        {/* Loading skeleton grids */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1c1c1c] h-52 rounded-2xl border border-neutral-800"></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && history.length === 0 && (
          <div className="bg-[#1c1c1c]/50 border border-neutral-800 border-dashed p-12 rounded-2xl text-center max-w-lg mx-auto">
            <Inbox className="text-neutral-600 mx-auto mb-4" size={48} />
            <h3 className="font-bold text-lg text-neutral-300">No Logs Found</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
              {search || filter
                ? "No products match your active search terms or health filters."
                : "You haven't scanned any products yet. Go to Scan Product to get started!"}
            </p>
          </div>
        )}

        {/* Main List Grid */}
        {!isLoading && history.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#1c1c1c] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group"
                >
                  {/* Delete Item floating button */}
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="absolute top-4 right-4 bg-neutral-900 hover:bg-red-950/60 text-neutral-500 hover:text-red-400 p-2 rounded-xl transition cursor-pointer"
                    title="Remove from history"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="flex gap-4 items-start">
                    {/* Image */}
                    <div className="w-16 h-16 bg-black border border-neutral-850 rounded-xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                        alt={item.productName}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                    {/* Header Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block truncate">
                        {item.brand || "Generic Brand"}
                      </span>
                      <h3 className="font-extrabold text-sm text-neutral-200 mt-0.5 truncate" title={item.productName}>
                        {item.productName}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                        {item.barcode}
                      </span>
                    </div>
                  </div>

                  {/* Rating / Score Indicator */}
                  <div className="my-4 bg-black/60 border border-neutral-850/80 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-emerald-400" />
                      <span className="text-xs text-neutral-400 font-mono">
                        Score: <b className="text-emerald-400">{item.healthScore}</b>/100
                      </span>
                    </div>
                    
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                        item.status === "Healthy"
                          ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                          : item.status === "Unhealthy"
                          ? "text-red-500 border-red-500/30 bg-red-500/10"
                          : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Scan Date Stamp */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-850/80 pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(item.scanDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(item.scanDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-[#1c1c1c] border border-neutral-800 text-neutral-300 py-2.5 px-4 rounded-xl hover:bg-neutral-850 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer text-sm"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="text-xs font-mono text-neutral-400">
                  Page <b>{page}</b> of <b>{totalPages}</b>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-[#1c1c1c] border border-neutral-800 text-neutral-300 py-2.5 px-4 rounded-xl hover:bg-neutral-850 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer text-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
