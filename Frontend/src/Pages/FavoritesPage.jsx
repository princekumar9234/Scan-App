import React, { useState, useEffect } from "react";
import {
  Heart,
  Trash2,
  Inbox,
  TrendingUp,
  ExternalLink,
  HeartCrack,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import HomeNav from "../Components/Homes/HomeNav";
import ClientServer from "./ClientServer";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const res = await ClientServer.get("/api/favorites");
      if (res.data && res.data.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load favorites.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFav = async (id) => {
    if (!window.confirm("Remove this product from favorites?")) return;
    try {
      const res = await ClientServer.delete(`/api/favorites/${id}`);
      if (res.data && res.data.success) {
        toast.success("Removed from favorites.");
        fetchFavorites();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
    }
  };

  const scanAgain = (barcodeVal) => {
    // Navigate back to scanner page and pre-fill barcode
    navigate("/scan", { state: { barcode: barcodeVal } });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-12">
      <Toaster position="top-center" />
      <HomeNav />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Header Title */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 font-mono">
            Bookmarked Products
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            My Favorites
          </h1>
        </div>

        {/* Loading skeleton grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1c1c1c] h-52 rounded-2xl border border-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && favorites.length === 0 && (
          <div className="bg-[#1c1c1c]/50 border border-neutral-800 border-dashed p-12 rounded-2xl text-center max-w-lg mx-auto">
            <HeartCrack className="text-neutral-600 mx-auto mb-4" size={48} />
            <h3 className="font-bold text-lg text-neutral-300">
              No Favorites Yet
            </h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
              Save your favorite food products during analysis to access them
              quickly here.
            </p>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div
                key={item._id}
                className="bg-[#1c1c1c] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFav(item._id)}
                  className="absolute top-4 right-4 bg-neutral-900 hover:bg-red-950/60 text-neutral-500 hover:text-red-400 p-2 rounded-xl transition cursor-pointer"
                  title="Remove Favorite"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex gap-4 items-start">
                  {/* Image */}
                  <div className="w-16 h-16 bg-black border border-neutral-850 rounded-xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"
                      }
                      alt={item.productName}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block truncate">
                      {item.brand || "Generic Brand"}
                    </span>
                    <h3
                      className="font-extrabold text-sm text-neutral-200 mt-0.5 truncate"
                      title={item.productName}
                    >
                      {item.productName}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                      {item.barcode}
                    </span>
                  </div>
                </div>

                {/* Score & Re-scan Actions */}
                <div className="mt-4 pt-4 border-t border-neutral-850 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
                        item.status === "Healthy"
                          ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                          : item.status === "Unhealthy"
                            ? "text-red-500 border-red-500/30 bg-red-500/10"
                            : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                      }`}
                    >
                      {item.status} ({item.healthScore})
                    </span>
                  </div>

                  <button
                    onClick={() => scanAgain(item.barcode)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    View Details
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
