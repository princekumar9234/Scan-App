import React, { useState, useEffect, useRef } from "react";
import { X, Camera, RefreshCw, Check, AlertCircle, Play } from "lucide-react";

// Mock products database for interactive scanning
export const MOCK_PRODUCTS = {
  lays: {
    id: "lays",
    name: "Lay's Classic",
    brand: "PepsiCo",
    category: "Potato Chips",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // chips fallback
    barcode: "028400015934",
    score: 65,
    grade: "Moderate",
    gradeColor: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    metrics: {
      calories: { value: "160", unit: "kcal", status: "high" },
      sugar: { value: "0.5", unit: "g", status: "low" },
      sodium: { value: "170", unit: "mg", status: "high" },
      fat: { value: "10", unit: "g", status: "moderate" }
    },
    ingredients: [
      { name: "No Artificial Colors", status: "success", text: "Free of synthetic dyes" },
      { name: "High Sodium", status: "warning", text: "Contains 170mg of sodium per serving" },
      { name: "Contains Trans Fat", status: "error", text: "Contains hydrogenated oils" },
      { name: "No Added Sugar", status: "success", text: "Contains no added sweeteners" }
    ]
  },
  oreo: {
    id: "oreo",
    name: "Oreo Original",
    brand: "Nabisco",
    category: "Cookies",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // cookies fallback
    barcode: "044000032028",
    score: 35,
    grade: "Unhealthy",
    gradeColor: "text-red-500 border-red-500/30 bg-red-500/10",
    metrics: {
      calories: { value: "140", unit: "kcal", status: "high" },
      sugar: { value: "14.0", unit: "g", status: "high" },
      sodium: { value: "90", unit: "mg", status: "moderate" },
      fat: { value: "7", unit: "g", status: "moderate" }
    },
    ingredients: [
      { name: "Artificial Flavors", status: "error", text: "Contains synthetic vanilla flavor" },
      { name: "High Sugar Content", status: "error", text: "14g of sugar per 3 cookies" },
      { name: "Contains Wheat & Soy", status: "warning", text: "Common allergens present" },
      { name: "No High Fructose Corn Syrup", status: "success", text: "Uses real sugar instead of HFCS" }
    ]
  },
  apple: {
    id: "apple",
    name: "Organic Gala Apples",
    brand: "Fresh Farms",
    category: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // apples fallback
    barcode: "413012345678",
    score: 98,
    grade: "Healthy",
    gradeColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    metrics: {
      calories: { value: "52", unit: "kcal", status: "low" },
      sugar: { value: "10.0", unit: "g", status: "low" },
      sodium: { value: "1", unit: "mg", status: "low" },
      fat: { value: "0.2", unit: "g", status: "low" }
    },
    ingredients: [
      { name: "100% Organic", status: "success", text: "No chemical fertilizers used" },
      { name: "Rich in Fiber", status: "success", text: "Helps maintain gut health" },
      { name: "Zero Trans Fats", status: "success", text: "No saturated or trans fats" },
      { name: "Rich in Antioxidants", status: "success", text: "Contains Vitamin C and potassium" }
    ]
  }
};

const MockScanner = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanMode, setScanMode] = useState("idle"); // idle, camera, simulated
  const [cameraAllowed, setCameraAllowed] = useState(null);
  const [simStatus, setSimStatus] = useState("");
  const [simProgress, setSimProgress] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop video stream helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Cleanup on close/unmount
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanMode("idle");
      setSimProgress(0);
      setSimStatus("");
    }
    return () => stopCamera();
  }, [isOpen]);

  // Handle opening camera
  const startCamera = async () => {
    setScanMode("camera");
    setCameraAllowed(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAllowed(true);

      // Simulate a barcode detected after 3.5 seconds of camera mode
      setTimeout(() => {
        if (streamRef.current) {
          triggerSuccess("lays"); // Default lays scan
        }
      }, 3500);
    } catch (err) {
      console.error("Camera access failed", err);
      setCameraAllowed(false);
      // Fallback to simulation automatically if camera fails
      startSimulation();
    }
  };

  // Run mock simulation sequence
  const startSimulation = (selectedId = "lays") => {
    stopCamera();
    setScanMode("simulated");
    setSimProgress(0);
    
    const logs = [
      { text: "Initializing High-Speed Barcode Reader...", delay: 200, progress: 10 },
      { text: "Targeting package boundaries...", delay: 800, progress: 35 },
      { text: "Detecting barcode format (EAN-13)...", delay: 1400, progress: 60 },
      { text: "Barcode recognized! Querying database...", delay: 2000, progress: 85 },
      { text: "Fetching ingredients and allergen profiles...", delay: 2600, progress: 95 },
      { text: "Nutrition summary successfully verified!", delay: 3000, progress: 100 }
    ];

    logs.forEach((log) => {
      setTimeout(() => {
        if (isOpen) {
          setSimStatus(log.text);
          setSimProgress(log.progress);
          if (log.progress === 100) {
            setTimeout(() => {
              triggerSuccess(selectedId);
            }, 500);
          }
        }
      }, log.delay);
    });
  };

  const triggerSuccess = (productId) => {
    const product = MOCK_PRODUCTS[productId];
    onScanSuccess(product);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-800 bg-[#0c0f16]/95 p-6 text-white shadow-2xl shadow-emerald-950/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glowing border accent */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-emerald-500 to-transparent"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 animate-pulse rounded-full bg-emerald-500"></span>
            <h3 className="font-bold text-lg tracking-wide text-neutral-100 font-sans">Live Product Scanner</h3>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full bg-neutral-900 p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Body */}
        <div className="my-6 min-h-75 flex flex-col justify-center items-center">
          
          {/* Idle screen */}
          {scanMode === "idle" && (
            <div className="text-center flex flex-col items-center max-w-sm w-full">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400">
                <Camera size={38} className="animate-pulse" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-neutral-100 font-sans">Select Scanning Mode</h4>
              <p className="text-sm text-neutral-400 mb-6 font-sans">
                Use your device camera to scan a barcode, or select a demo product to simulate scanning.
              </p>
              
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={startCamera}
                  className="w-full py-3 px-4 rounded-xl font-medium bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Camera size={18} />
                  Use Device Camera
                </button>
                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-neutral-850"></div>
                  <span className="shrink mx-4 text-xs text-neutral-500 uppercase tracking-widest font-mono">Or Select Demo Scan</span>
                  <div className="grow border-t border-neutral-850"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => startSimulation("lays")}
                    className="py-2.5 px-1 rounded-lg text-xs font-semibold border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition cursor-pointer text-neutral-200"
                  >
                    Lay's Chips (65)
                  </button>
                  <button
                    onClick={() => startSimulation("oreo")}
                    className="py-2.5 px-1 rounded-lg text-xs font-semibold border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition cursor-pointer text-neutral-200"
                  >
                    Oreo Cookies (35)
                  </button>
                  <button
                    onClick={() => startSimulation("apple")}
                    className="py-2.5 px-1 rounded-lg text-xs font-semibold border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition cursor-pointer text-neutral-200"
                  >
                    Gala Apple (98)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Scan Screen */}
          {scanMode === "camera" && (
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-black border border-neutral-800 flex items-center justify-center">
              {cameraAllowed === null && (
                <div className="flex flex-col items-center gap-3 text-neutral-400 text-sm">
                  <RefreshCw className="animate-spin text-emerald-400" size={24} />
                  <span>Requesting Camera Permission...</span>
                </div>
              )}
              {cameraAllowed === false && (
                <div className="p-6 text-center max-w-sm flex flex-col items-center gap-3">
                  <AlertCircle className="text-red-500" size={32} />
                  <h5 className="font-semibold text-neutral-200 font-sans">Camera Access Denied</h5>
                  <p className="text-xs text-neutral-400 font-sans">
                    We could not access your camera. Starting the barcode scanning simulator instead.
                  </p>
                </div>
              )}
              {cameraAllowed === true && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Cybernetic Scan Overlay */}
                  <div className="absolute inset-0 border-2 border-emerald-500/20 pointer-events-none">
                    {/* Glowing corners */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></div>

                    {/* Laser scan line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] top-1/2 -translate-y-1/2 animate-scan"></div>
                    
                    {/* Targeting box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-dashed border-emerald-400/50 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded font-mono">
                        Align Barcode
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button 
                      onClick={() => startSimulation("lays")} 
                      className="px-4 py-1.5 rounded-full text-xs font-semibold bg-black/80 hover:bg-black text-neutral-300 border border-neutral-700/60 transition cursor-pointer"
                    >
                      Use Simulator Instead
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Simulation screen */}
          {scanMode === "simulated" && (
            <div className="w-full text-center flex flex-col items-center p-4">
              {/* Virtual Scanner visual */}
              <div className="relative w-48 h-24 border border-dashed border-emerald-500/30 rounded-xl flex items-center justify-center bg-emerald-950/5 mb-8 overflow-hidden">
                <div className="flex flex-col items-center gap-1.5 opacity-40">
                  <div className="flex gap-0.5 items-end justify-center h-8">
                    {[2, 4, 3, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 2, 4, 1, 3, 4, 2].map((h, i) => (
                      <div key={i} style={{ height: `${h * 6}px` }} className="w-1 bg-white rounded-t-sm"></div>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-white">BARCODE DETECTED</span>
                </div>
                {/* Simulated laser */}
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_6px_#34d399] top-1/2 animate-scan"></div>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981] transition-all duration-300 ease-out"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>

              {/* Status log */}
              <p className="text-sm font-mono text-emerald-400 h-6 truncate animate-pulse">
                &gt; {simStatus || "Connecting to core neural analyzer..."}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-neutral-900/60 pt-4 flex justify-between items-center text-xs text-neutral-500 font-mono">
          <span>Secure AES-256 Analysis</span>
          <span>v2.1.0-prod</span>
        </div>

      </div>
    </div>
  );
};

export default MockScanner;
