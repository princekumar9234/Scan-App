import React, { useState, useEffect } from "react";
import HomeNav from "./HomeNav";
import {
  Scan,
  TrendingUp,
  Heart,
  AlertTriangle,
  History,
  Activity,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart2,
  PieChart,
  Flame,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientServer from "../../Pages/ClientServer";
import toast, { Toaster } from "react-hot-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await ClientServer.get("/api/history/stats/summary");
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeNumber = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter a barcode number.");
      return;
    }
    // Navigate to ScanPage and search
    navigate("/scan", { state: { barcode: text.trim() } });
  };

  // Compute percentages for distribution chart
  const cards = stats?.cards || {
    totalScans: 0,
    healthyProducts: 0,
    moderateProducts: 0,
    unhealthyProducts: 0,
    favorites: 0,
  };
  const total = cards.totalScans || 1; // avoid divide by zero
  const healthyPct = Math.round((cards.healthyProducts / total) * 100);
  const moderatePct = Math.round((cards.moderateProducts / total) * 100);
  const unhealthyPct = Math.round((cards.unhealthyProducts / total) * 100);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-12">
      <Toaster position="top-center" />
      <HomeNav />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Search Barcode Section */}
        <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] mb-8">
          <form
            className="flex flex-col sm:flex-row items-center gap-4"
            onSubmit={handleBarCodeNumber}
          >
            <input
              onChange={(e) => setText(e.target.value)}
              type="text"
              value={text}
              placeholder="Enter or Scan Barcode Number (e.g. 8901491101835)"
              className="w-full bg-black p-3.5 rounded-xl border border-neutral-800 focus:border-emerald-400 outline-none text-sm text-gray-200 transition focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-black font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_8px_20px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.6)] text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Scan size={18} />
              Quick Scan
            </button>
          </form>
        </div>

        {isLoading ? (
          /* Loading Skeleton */
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1c1c1c] h-28 rounded-xl border border-neutral-850"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1c1c] h-80 rounded-2xl border border-neutral-800 md:col-span-2"></div>
              <div className="bg-[#1c1c1c] h-80 rounded-2xl border border-neutral-800"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {/* Card 1: Total Scans */}
              <div className="bg-linear-to-br from-[#0c0f16]/95 to-blue-950/20 border border-neutral-850 hover:border-blue-500/30 p-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-center transition duration-300">
                <History className="text-blue-400 mx-auto mb-2" size={20} />
                <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                  Total Scans
                </h3>
                <p className="text-2xl font-black text-blue-400 mt-1">
                  {cards.totalScans}
                </p>
              </div>

              {/* Card 2: Healthy */}
              <div className="bg-linear-to-br from-[#0c0f16]/95 to-emerald-950/20 border border-neutral-850 hover:border-emerald-500/30 p-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-center transition duration-300">
                <CheckCircle2
                  className="text-emerald-400 mx-auto mb-2"
                  size={20}
                />
                <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                  Healthy
                </h3>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {cards.healthyProducts}
                </p>
              </div>

              {/* Card 3: Moderate */}
              <div className="bg-linear-to-br from-[#0c0f16]/95 to-amber-950/20 border border-neutral-850 hover:border-amber-500/30 p-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-center transition duration-300">
                <AlertTriangle
                  className="text-amber-500 mx-auto mb-2"
                  size={20}
                />
                <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                  Moderate
                </h3>
                <p className="text-2xl font-black text-amber-500 mt-1">
                  {cards.moderateProducts}
                </p>
              </div>

              {/* Card 4: Unhealthy */}
              <div className="bg-linear-to-br from-[#0c0f16]/95 to-red-950/20 border border-neutral-850 hover:border-red-500/30 p-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-center transition duration-300">
                <XCircle className="text-red-500 mx-auto mb-2" size={20} />
                <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                  Unhealthy
                </h3>
                <p className="text-2xl font-black text-red-500 mt-1">
                  {cards.unhealthyProducts}
                </p>
              </div>

              {/* Card 5: Favorites */}
              <div className="bg-linear-to-br from-[#0c0f16]/95 to-pink-950/20 border border-neutral-850 hover:border-pink-500/30 p-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-center transition duration-300 col-span-2 sm:col-span-3 md:col-span-1">
                <Heart
                  className="text-pink-500 fill-pink-500/10 mx-auto mb-2"
                  size={20}
                />
                <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                  Favorites
                </h3>
                <p className="text-2xl font-black text-pink-500 mt-1">
                  {cards.favorites}
                </p>
              </div>
            </div>

            {/* Charts & Analytics Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Weekly Scan Volume (Custom SVG Bar Chart) */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] md:col-span-2">
                <h3 className="font-bold text-base text-neutral-200 mb-4 flex items-center gap-2">
                  <BarChart2 size={18} className="text-blue-400" /> Weekly Scan
                  Chart
                </h3>

                {stats?.charts?.weeklyScan &&
                stats.charts.weeklyScan.length > 0 ? (
                  <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-neutral-850 pb-2">
                    {stats.charts.weeklyScan.map((day, idx) => {
                      const maxCount = Math.max(
                        ...stats.charts.weeklyScan.map((d) => d.count),
                        1,
                      );
                      const heightPercent = (day.count / maxCount) * 80; // keep max at 80% for aesthetic spacing
                      const dateObj = new Date(day._id);
                      const dayName = dateObj.toLocaleDateString([], {
                        weekday: "short",
                      });

                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center group"
                        >
                          {/* Count display on hover */}
                          <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition duration-200 mb-1 font-mono font-bold">
                            {day.count}
                          </span>
                          {/* SVG Bar */}
                          <div
                            style={{ height: `${Math.max(8, heightPercent)}%` }}
                            className="w-full bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-teal-400 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          ></div>
                          {/* Day Label */}
                          <span className="text-[10px] text-neutral-500 mt-2 font-semibold">
                            {dayName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex flex-col justify-center items-center text-center">
                    <Activity
                      className="text-neutral-600 mb-2 animate-pulse"
                      size={32}
                    />
                    <p className="text-xs text-neutral-500">
                      No scans recorded in the last 7 days.
                    </p>
                  </div>
                )}
              </div>

              {/* Health Grade Distribution percentage bars */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                <h3 className="font-bold text-base text-neutral-200 mb-4 flex items-center gap-2">
                  <PieChart size={18} className="text-emerald-400" /> Health
                  Distribution
                </h3>

                {cards.totalScans > 0 ? (
                  <div className="space-y-4 pt-4">
                    {/* Healthy bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-emerald-400">Healthy</span>
                        <span>
                          {healthyPct}% ({cards.healthyProducts})
                        </span>
                      </div>
                      <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-neutral-850">
                        <div
                          style={{ width: `${healthyPct}%` }}
                          className="bg-emerald-400 h-full rounded-full"
                        ></div>
                      </div>
                    </div>

                    {/* Moderate bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-amber-500">Moderate</span>
                        <span>
                          {moderatePct}% ({cards.moderateProducts})
                        </span>
                      </div>
                      <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-neutral-850">
                        <div
                          style={{ width: `${moderatePct}%` }}
                          className="bg-amber-500 h-full rounded-full"
                        ></div>
                      </div>
                    </div>

                    {/* Unhealthy bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-red-500">Unhealthy</span>
                        <span>
                          {unhealthyPct}% ({cards.unhealthyProducts})
                        </span>
                      </div>
                      <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-neutral-850">
                        <div
                          style={{ width: `${unhealthyPct}%` }}
                          className="bg-red-500 h-full rounded-full"
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-36 flex flex-col justify-center items-center text-center">
                    <Activity className="text-neutral-600 mb-2" size={32} />
                    <p className="text-xs text-neutral-500">
                      No items available for analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Most Scanned Products & Recent Scans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Scanned Products */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                <h3 className="font-bold text-base text-neutral-200 mb-4 flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" /> Most Scanned
                  Products
                </h3>

                {stats?.charts?.mostScanned &&
                stats.charts.mostScanned.length > 0 ? (
                  <div className="divide-y divide-neutral-850">
                    {stats.charts.mostScanned.map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-black border border-neutral-850 rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                            <img
                              src={
                                prod.image ||
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=50"
                              }
                              alt=""
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-extrabold text-neutral-200 truncate">
                              {prod.productName}
                            </h4>
                            <span className="text-[10px] text-neutral-500 font-mono block truncate">
                              {prod.brand}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold bg-neutral-900 border border-neutral-800 text-emerald-400 py-1 px-2.5 rounded-lg shrink-0">
                          {prod.count} scans
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 py-8 text-center">
                    No scans recorded yet.
                  </p>
                )}
              </div>

              {/* Recent Scan History */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                <h3 className="font-bold text-base text-neutral-200 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-400" /> Recent
                  Scans
                </h3>

                {stats?.recentScans && stats.recentScans.length > 0 ? (
                  <div className="divide-y divide-neutral-850">
                    {stats.recentScans.map((scan, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-black border border-neutral-850 rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                            <img
                              src={
                                scan.image ||
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=50"
                              }
                              alt=""
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-extrabold text-neutral-200 truncate">
                              {scan.productName}
                            </h4>
                            <span className="text-[10px] text-neutral-500 font-mono block">
                              {new Date(scan.scanDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${
                            scan.status === "Healthy"
                              ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                              : scan.status === "Unhealthy"
                                ? "text-red-500 border-red-500/30 bg-red-500/10"
                                : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                          }`}
                        >
                          {scan.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 py-8 text-center">
                    No scans recorded yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
