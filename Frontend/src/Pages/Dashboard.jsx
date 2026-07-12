import React, { useState } from "react";
import {
  Sparkles,
  Scan,
  Play,
  Check,
  Heart,
  Shield,
  History,
  Star,
  ChevronRight,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Battery,
  Wifi,
  Activity,
} from "lucide-react";
import { MOCK_PRODUCTS } from "../Components/MockScanner";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(MOCK_PRODUCTS.lays);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const startWatchDemo = () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);

    // Cycle products to simulate scanning
    const products = ["oreo", "apple", "lays"];
    let cycleIndex = 0;

    const interval = setInterval(() => {
      if (cycleIndex < products.length) {
        setCurrentProduct(MOCK_PRODUCTS[products[cycleIndex]]);
        cycleIndex++;
      } else {
        clearInterval(interval);
        setIsDemoRunning(false);
      }
    }, 2000);
  };

  const handleClick = () => {
    (alert("please Login First"), navigate("/login"));
  };
  return ( 
    
    <div className="min-h-screen bg-[#07090e] text-white overflow-x-hidden font-sans relative">
        <Navbar />
      {/* Background Radial Glow Details */}
      <div className="absolute top-[20%] left-[10%] w-112.5 h-112.5 bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[35%] right-[5%] w-125 h-125 bg-[#0ea5e9]/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[20%] w-150 h-150 bg-emerald-600/5 rounded-full filter blur-[180px] pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-8 pb-20 lg:pt-16 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide mb-6 animate-fade-in">
              <Sparkles
                size={13}
                className="text-emerald-400 fill-emerald-400/20"
              />
              <span>Smart Food Product Scanner</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 font-sans">
              Scan Smarter. <br />
              <span className="bg-linear-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                Eat Healthier.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mb-8 leading-relaxed font-sans">
              Scan any packaged food barcode and instantly get nutrition facts,
              ingredients, and health insights in seconds.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={(e) => handleClick(e)}
                className="group px-6 py-4 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-base"
              >
                <Scan
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
                <span>Scan a Product Now</span>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={startWatchDemo}
                disabled={isDemoRunning}
                className="px-6 py-4 rounded-xl font-bold border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-850 hover:border-neutral-700 flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-base text-neutral-200"
              >
                <Play
                  size={18}
                  className={`fill-white/10 ${isDemoRunning ? "animate-spin" : ""}`}
                />
                <span>{isDemoRunning ? "Running Demo..." : "Watch Demo"}</span>
              </button>
            </div>

            {/* Checkmark badges */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-y-4 gap-x-6 text-sm text-neutral-400 border-t border-neutral-900 pt-8 w-full">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
                  <Check size={12} />
                </div>
                <span className="font-medium font-sans">100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
                  <Check size={12} />
                </div>
                <span className="font-medium font-sans">
                  No Signup Required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
                  <Check size={12} />
                </div>
                <span className="font-medium font-sans">Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
                  <Check size={12} />
                </div>
                <span className="font-medium font-sans">Privacy Friendly</span>
              </div>
            </div>
          </div>

          {/* Right Column: Physical mockup back and iPhone result overlap */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-135 w-full mt-10 lg:mt-0">
            {/* 1. Behind the phone: Styled packaging mockup */}
            <div className="absolute left-[8%] md:left-[12%] lg:left-[5%] top-[12%] w-47.5 h-85 rounded-2xl bg-linear-to-b from-[#eab308] to-[#ca8a04] border border-yellow-400/20 shadow-xl overflow-hidden hidden sm:flex flex-col justify-between p-4 -rotate-6 opacity-70 hover:opacity-85 transition-all duration-500">
              {/* Layout for mock chip bag */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono tracking-widest text-black/75 uppercase font-bold">
                  CLASSIC PACK
                </span>
                <div className="w-14 h-14 rounded-full bg-red-600 border border-red-500 shadow-md flex items-center justify-center mt-6">
                  <span className="text-white text-xs font-extrabold uppercase italic tracking-tighter">
                    Lay's
                  </span>
                </div>
              </div>

              {/* Scanner effect area */}
              <div className="relative bg-white/95 rounded p-2 flex flex-col items-center">
                {/* Barcode visual */}
                <div className="flex gap-0.5 items-end justify-center h-10 w-full mb-1">
                  {[1, 3, 2, 4, 1, 3, 1, 4, 2, 1, 4, 3, 2, 1, 3, 1, 4].map(
                    (w, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${w * 1.5}px` }}
                        className="h-full bg-black"
                      ></div>
                    ),
                  )}
                </div>
                <span className="text-[7px] font-mono text-black">
                  284000 159340
                </span>

                {/* Scanning green line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] top-1/2 -translate-y-1/2 animate-laser"></div>
              </div>
            </div>

            {/* 2. Front phone mockup (Interactive details) */}
            <div className="relative z-20 w-68.75 h-130 rounded-[38px] border-8 border-neutral-800 bg-black shadow-2xl shadow-emerald-950/20 flex flex-col overflow-hidden select-none hover:border-neutral-750 transition-all duration-300">
              {/* iPhone top sensor bar */}
              <div className="absolute top-0 inset-x-0 h-5 bg-black flex justify-between px-6 items-center text-[9px] text-neutral-400 font-mono z-30">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-neutral-900 rounded-full border border-neutral-800/60 absolute left-1/2 -translate-x-1/2 top-1"></div>
                <div className="flex items-center gap-1">
                  <Wifi size={8} />
                  <Battery size={10} className="rotate-0" />
                </div>
              </div>

              {/* Internal phone app contents */}
              <div className="flex-1 bg-[#090b0e] pt-6 flex flex-col text-left">
                {/* Navigation Bar inside App */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900/60 bg-[#090b0e]/90">
                  <button className="text-emerald-400 hover:text-emerald-300">
                    <ArrowLeft size={14} />
                  </button>
                  <span className="text-xs font-bold text-neutral-300 tracking-wide">
                    Scan Result
                  </span>
                  <div className="w-3.5 h-3.5"></div>
                </div>

                {/* Scanned product info container */}
                <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin">
                  {/* Product card */}
                  <div className="relative rounded-2xl bg-neutral-900/70 border border-neutral-800/80 p-3 flex flex-col items-center text-center mb-3.5">
                    {/* Glowing background behind image */}
                    <div className="absolute top-2 w-14 h-14 bg-emerald-500/10 rounded-full filter blur-xl"></div>

                    <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-1.5 mb-2 relative z-10">
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-100 leading-tight">
                      {currentProduct.name}
                    </h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      {currentProduct.category} • {currentProduct.brand}
                    </p>

                    {/* Unified health badge score */}
                    <div className="flex items-center gap-2 mt-3.5 w-full bg-neutral-950/60 p-2 rounded-xl border border-neutral-900">
                      {/* Radial score circle */}
                      <div className="relative flex items-center justify-center w-9 h-9 rounded-full border border-neutral-800 bg-neutral-950">
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          {currentProduct.score}
                        </span>
                        <span className="absolute text-[6px] text-neutral-500 font-mono bottom-1">
                          /100
                        </span>
                      </div>

                      <div className="flex-1 text-left">
                        <span
                          className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${currentProduct.gradeColor}`}
                        >
                          {currentProduct.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nutrients Metrics Cards */}
                  <div className="grid grid-cols-4 gap-1.5 mb-4">
                    {Object.entries(currentProduct.metrics).map(
                      ([key, metric]) => (
                        <div
                          key={key}
                          className="bg-neutral-950/70 border border-neutral-900/80 rounded-xl p-1.5 flex flex-col items-center justify-center text-center"
                        >
                          <span className="text-[8px] text-neutral-500 uppercase tracking-wider">
                            {key}
                          </span>
                          <span
                            className={`text-[10px] font-bold mt-0.5 ${
                              metric.status === "high"
                                ? "text-amber-500"
                                : metric.status === "moderate"
                                  ? "text-yellow-400"
                                  : "text-emerald-400"
                            }`}
                          >
                            {metric.value}
                          </span>
                          <span className="text-[7px] text-neutral-600">
                            {metric.unit}
                          </span>
                        </div>
                      ),
                    )}
                  </div>

                  {/* What's Inside section */}
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
                      What's Inside?
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {currentProduct.ingredients.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-950/40 border border-neutral-900/80 rounded-lg p-2 flex items-start gap-2"
                        >
                          <span className="mt-0.5 shrink-0">
                            {item.status === "success" && (
                              <CheckCircle2
                                className="text-emerald-400 fill-emerald-500/10"
                                size={11}
                              />
                            )}
                            {item.status === "warning" && (
                              <AlertTriangle
                                className="text-amber-400"
                                size={11}
                              />
                            )}
                            {item.status === "error" && (
                              <XCircle
                                className="text-red-500 fill-red-500/10"
                                size={11}
                              />
                            )}
                          </span>
                          <div className="flex flex-col leading-tight">
                            <span className="text-[9px] font-bold text-neutral-200">
                              {item.name}
                            </span>
                            <span className="text-[7px] text-neutral-500 mt-0.5">
                              {item.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Floating steps on the right side pointing to phone */}
            <div className="absolute right-[-10%] md:right-[5%] lg:right-[-4%] xl:right-[-8%] top-[10%] flex flex-col gap-4 z-30 max-w-38.75 sm:max-w-45">
              {/* Step 1: Scan */}
              <div className="group bg-[#0d121c]/90 border border-neutral-800/80 p-3 rounded-xl flex gap-3 shadow-lg backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Scan size={14} />
                </div>
                <div className="text-left flex flex-col leading-tight justify-center">
                  <span className="text-xs font-bold text-neutral-200">
                    Scan
                  </span>
                  <span className="text-[9px] text-neutral-400 mt-0.5">
                    Scan any barcode in seconds
                  </span>
                </div>
              </div>

              {/* Step 2: Analyze */}
              <div className="group bg-[#0d121c]/90 border border-neutral-800/80 p-3 rounded-xl flex gap-3 shadow-lg backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Activity size={14} />
                </div>
                <div className="text-left flex flex-col leading-tight justify-center">
                  <span className="text-xs font-bold text-neutral-200">
                    Analyze
                  </span>
                  <span className="text-[9px] text-neutral-400 mt-0.5">
                    Get nutrition & health insights
                  </span>
                </div>
              </div>

              {/* Step 3: Choose Better */}
              <div className="group bg-[#0d121c]/90 border border-neutral-800/80 p-3 rounded-xl flex gap-3 shadow-lg backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Heart size={14} />
                </div>
                <div className="text-left flex flex-col leading-tight justify-center">
                  <span className="text-xs font-bold text-neutral-200">
                    Choose Better
                  </span>
                  <span className="text-[9px] text-neutral-400 mt-0.5">
                    Make healthier choices daily
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POWERFUL FEATURES SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 border-t border-neutral-900/60 z-10">
        <div className="text-center mb-12">
          {/* Label */}
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-500 font-mono">
            Powerful Features
          </span>
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-4 font-sans">
            Everything You Need for Smarter Choices
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Features 6-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {/* Feature 1: Instant Scan */}
          <div className="group bg-[#0c0f16]/95 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Scan size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-neutral-200 mb-2 font-sans">
              Instant Scan
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Scan any product barcode using your camera and get instant
              results.
            </p>
          </div>

          {/* Feature 2: Nutrition Facts */}
          <div className="group bg-[#0c0f16]/95 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-neutral-200 mb-2 font-sans">
              Nutrition Facts
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Get detailed nutrition breakdown including calories, carbs,
              protein, fats, and more.
            </p>
          </div>

          {/* Feature 3: Health Score */}
          <div className="group bg-[#0c0f16]/95 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-neutral-200 mb-2 font-sans">
              Health Score
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Know if a product is Healthy, Moderate, or Unhealthy with our
              smart health scoring.
            </p>
          </div>

          {/* Feature 4: Health Insights */}
          <div className="group bg-[#0c0f16]/95 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Shield size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-neutral-200 mb-2 font-sans">
              Health Insights
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              See pros, cons, and warnings based on ingredients and nutrition
              content.
            </p>
          </div>

          {/* Feature 5: Scan History */}
          <div className="group bg-[#0c0f16]/95 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <History size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-neutral-200 mb-2 font-sans">
              Scan History
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              View all your scanned products anytime in your personal history.
            </p>
          </div>

          {/* Feature 6: Favorites */}
          <div className="group bg-[#0c0f16]/95 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Star size={22} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-neutral-200 mb-2 font-sans">
              Favorites
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Save your favorite products and access them anytime.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF / TRUSTED BY THOUSANDS FOOTER */}
      <section className="relative max-w-7xl mx-auto px-6 pb-20 z-10">
        <div className="bg-[#0c0f16]/90 border border-neutral-850/80 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-md">
          {/* Social Proof Text & Overlapping Avatars */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/35 border border-emerald-500/20 text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Shield size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-base text-neutral-100 leading-snug font-sans">
                Trusted by Thousands
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm font-sans">
                Join 10,000+ users who are making healthier choices every day.
              </p>
            </div>

            {/* Avatars pile */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3.5 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full border-2 border-neutral-900 object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full border-2 border-neutral-900 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full border-2 border-neutral-900 object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full border-2 border-neutral-900 object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-950 border border-emerald-500/20 text-emerald-400 font-mono">
                10K+
              </span>
            </div>
          </div>

          {/* Average Rating Stars */}
          <div className="flex flex-col items-center justify-center text-center lg:border-x lg:border-neutral-900 px-10 py-1 w-full lg:w-auto">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-yellow-500" />
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-300 mt-2 font-sans">
              4.8/5 average rating
            </span>
          </div>

          <div className="flex-1 text-center lg:text-left max-w-md w-full">
            <p className="text-xs text-neutral-300 italic leading-relaxed font-sans">
              "This app changed the way I shop and eat. Now I know what's inside
              every product I buy!"
            </p>
            <span className="block text-[10px] text-emerald-400 font-bold mt-2 font-mono uppercase tracking-wider">
              — Sarah K.
            </span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes laser {
          0%, 100% { top: 15%; }
          50% { top: 85%; }
        }
        .animate-laser {
          animation: laser 3.5s infinite ease-in-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #090b0e;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 9px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
