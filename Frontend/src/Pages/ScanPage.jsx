import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import {
  Scan,
  Heart,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  FileText,
  Camera,
  Activity,
  HeartCrack,
  Upload,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import HomeNav from "../Components/Homes/HomeNav";
import ClientServer from "./ClientServer";

const ScanPage = () => {
  const [barcode, setBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [product, setProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop scanner utility
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((err) => console.log("Clear scanner err:", err));
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    // Cleanup scanner on component unmount
    return () => {
      stopScanner();
    };
  }, []);

  /**
   * Attempts to decode a barcode from an image file using multiple strategies:
   *  - First pre-processes/down-scales the image (max 800px) which drastically
   *    improves decode rates for high-res smartphone camera photos.
   *  - Runs both resized and original variations through ZXing (with hints),
   *    ZXing (no hints), and Html5Qrcode engines.
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = ""; // Reset file input
    if (!file) return;

    setIsLoading(true);
    setErrorMsg("");
    setProduct(null);

    // ── Helper: Image Preprocessor/Resizer ──────────────────────────────────
    const preprocessImage = (imageFile, maxDim = 800) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedUrl = URL.createObjectURL(blob);
              resolve({
                url: resizedUrl,
                file: new File([blob], imageFile.name, { type: imageFile.type })
              });
            } else {
              resolve({ url: URL.createObjectURL(imageFile), file: imageFile });
            }
          }, imageFile.type);
        };
        img.onerror = () => {
          resolve({ url: URL.createObjectURL(imageFile), file: imageFile });
        };
        img.src = URL.createObjectURL(imageFile);
      });
    };

    // ── Helper: decode via ZXing with Console Suppression ───────────────────
    const tryZxing = (imageUrl, hints) =>
      new Promise((resolve) => {
        const originalWarn = console.warn;
        const originalError = console.error;
        console.warn = () => {};
        console.error = () => {};

        const codeReader = hints
          ? new BrowserMultiFormatReader(hints)
          : new BrowserMultiFormatReader();
        codeReader
          .decodeFromImageUrl(imageUrl)
          .then((r) => {
            console.warn = originalWarn;
            console.error = originalError;
            resolve(r?.text || null);
          })
          .catch(() => {
            console.warn = originalWarn;
            console.error = originalError;
            resolve(null);
          });
      });

    // ── Helper: decode via Html5Qrcode ──────────────────────────────────────
    const tryHtml5Qrcode = (imageFile) =>
      new Promise((resolve) => {
        const tempId = "__h5qr_temp__";
        let container = document.getElementById(tempId);
        if (!container) {
          container = document.createElement("div");
          container.id = tempId;
          container.style.display = "none";
          document.body.appendChild(container);
        }
        const scanner = new Html5Qrcode(tempId);
        scanner
          .scanFile(imageFile, false)
          .then((text) => {
            resolve(text || null);
          })
          .catch(() => {
            resolve(null);
          });
      });

    try {
      // 1. Preprocess/Resize image
      const resized = await preprocessImage(file, 800);
      const originalUrl = URL.createObjectURL(file);
      
      let detectedCode = null;

      // Create format hints map for ZXing
      const hints = new Map();
      if (BarcodeFormat && DecodeHintType) {
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.ITF,
          BarcodeFormat.DATA_MATRIX,
          BarcodeFormat.QR_CODE,
        ]);
        hints.set(DecodeHintType.TRY_HARDER, true);
      }

      // ── Strategy A: Decodes on resized image (extremely fast & high success on smart-photos) ──
      // Pass 1: ZXing hints (resized)
      detectedCode = await tryZxing(resized.url, hints);

      // Pass 2: ZXing no-hints (resized)
      if (!detectedCode) {
        detectedCode = await tryZxing(resized.url, null);
      }

      // Pass 3: Html5Qrcode (resized file)
      if (!detectedCode) {
        detectedCode = await tryHtml5Qrcode(resized.file);
      }

      // ── Strategy B: Fallback to original image (if resizing failed or code was very small) ──
      // Pass 4: ZXing hints (original)
      if (!detectedCode) {
        detectedCode = await tryZxing(originalUrl, hints);
      }

      // Pass 5: Html5Qrcode (original file)
      if (!detectedCode) {
        detectedCode = await tryHtml5Qrcode(file);
      }

      // Clean up object URLs
      URL.revokeObjectURL(originalUrl);
      if (resized.url !== originalUrl) {
        URL.revokeObjectURL(resized.url);
      }

      if (detectedCode) {
        setBarcode(detectedCode);
        toast.success(`Barcode detected: ${detectedCode}`);
        handleSearch(detectedCode);
      } else {
        toast.error("No barcode detected. Try a clearer or closer photo.");
        setErrorMsg(
          "Could not read a barcode from this image. Make sure the barcode is clearly visible and well-lit, then try again — or enter the barcode number manually.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Barcode scan error:", err);
      toast.error("Scan failed. Try entering the barcode manually.");
      setErrorMsg(
        "Failed to decode barcode from file. Try entering manually.",
      );
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const startScanner = () => {
    setErrorMsg("");
    setCameraActive(true);

    // Defer initialization slightly to ensure the reader div is in the DOM
    setTimeout(() => {
      try {
        const formats = [
          Html5QrcodeSupportedFormats?.EAN_13 || 9,
          Html5QrcodeSupportedFormats?.EAN_8 || 10,
          Html5QrcodeSupportedFormats?.UPC_A || 14,
          Html5QrcodeSupportedFormats?.UPC_E || 15,
          Html5QrcodeSupportedFormats?.CODE_128 || 5,
          Html5QrcodeSupportedFormats?.QR_CODE || 0,
        ];

        const scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 280, height: 180 },
            rememberLastUsedCamera: true,
            formatsToSupport: formats,
          },
          false,
        );

        scannerRef.current = scanner;

        const onScanSuccess = async (decodedText) => {
          stopScanner();
          handleSearch(decodedText);
        };

        const onScanError = (err) => {
          // Silent errors on camera frame scans are normal
        };

        scanner.render(onScanSuccess, onScanError);
      } catch (err) {
        console.error("Scanner init error:", err);
        setErrorMsg("Failed to access camera device. Check permissions.");
        setCameraActive(false);
      }
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!barcode.trim()) {
      toast.error("Please enter a valid barcode.");
      return;
    }
    handleSearch(barcode.trim());
  };

  const handleSearch = async (codeToSearch) => {
    setIsLoading(true);
    setErrorMsg("");
    setNotFound(false);
    setProduct(null);

    try {
      const res = await ClientServer.post("/api/products/scan", {
        barcode: codeToSearch,
      });
      if (res.data && res.data.success) {
        setProduct(res.data.data);
        toast.success(res.data.message || "Product analyzed!");
      } else {
        // Non-throwing 4xx responses (unlikely with axios, but safe)
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      if (status === 404) {
        // Product not found in database
        setNotFound(true);
      } else {
        const msg =
          err.response?.data?.message ||
          "Something went wrong. Please try again.";
        setErrorMsg(msg);
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async () => {
    if (!product) return;
    setIsFavoriting(true);
    try {
      const payload = {
        barcode: product.barcode,
        productName: product.productName,
        brand: product.brand,
        image: product.image,
        healthScore: product.healthAnalysis.score,
        status: product.healthAnalysis.status,
      };

      const res = await ClientServer.post("/api/favorites", payload);
      if (res.data && res.data.success) {
        toast.success("Added to favorites!");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Already favorited or failed to save.";
      toast.error(msg);
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-12">
      <Toaster position="top-center" reverseOrder={false} />
      <HomeNav />

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 font-mono">
            Smart Food Analyzer
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Scan Product
          </h1>
          <div className="w-12 h-1 bg-emerald-400 mx-auto rounded-full mt-3"></div>
        </div>

        {/* Input Barcode & Camera CTA Card */}
        <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter Barcode manually (e.g. 8901491101835, 7613035368417)"
              className="w-full bg-black p-3 rounded-xl border border-neutral-800 focus:border-emerald-400 outline-none text-sm text-gray-200 transition focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)]"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex gap-2 w-full sm:w-auto shrink-0 flex-wrap justify-center sm:justify-start">
              <button
                type="submit"
                disabled={isLoading}
                className="grow sm:grow-0 bg-emerald-400 hover:bg-emerald-300 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_8px_20px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.6)] text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Scan size={16} />
                )}
                Search
              </button>

              <button
                type="button"
                onClick={triggerFileSelect}
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold p-3 rounded-xl hover:bg-neutral-850 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                title="Scan from image file"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Upload Image</span>
              </button>

              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startScanner}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold p-3 rounded-xl hover:bg-neutral-850 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                  title="Open Camera Scanner"
                >
                  <Camera size={18} />
                  <span className="hidden sm:inline">Scan Live</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopScanner}
                  className="bg-red-950/40 border border-red-500/30 text-red-400 font-bold p-3 rounded-xl hover:bg-red-900/60 hover:text-red-300 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Scanner Viewport */}
          {cameraActive && (
            <div className="mt-6 border-2 border-dashed border-emerald-500/30 rounded-2xl overflow-hidden bg-black p-4 relative">
              <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] top-1/2 -translate-y-1/2 animate-laser z-10 pointer-events-none"></div>
              <div id="reader" className="w-full max-w-md mx-auto"></div>
              <p className="text-center text-xs text-neutral-400 mt-2 font-mono">
                Position the barcode inside the camera viewpoint.
              </p>
            </div>
          )}
        </div>

        {/* ── Loading Skeleton ──────────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-6">
            {/* Shimmer header */}
            <div className="relative bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 overflow-hidden flex gap-6 items-center">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="w-32 h-32 rounded-xl bg-neutral-800 shrink-0"></div>
              <div className="grow space-y-3">
                <div className="h-3 bg-neutral-800 rounded-full w-24"></div>
                <div className="h-6 bg-neutral-800 rounded-full w-64"></div>
                <div className="h-3 bg-neutral-800 rounded-full w-40"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative bg-[#1c1c1c] border border-neutral-800 rounded-2xl h-52 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_0.1s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
              <div className="relative bg-[#1c1c1c] border border-neutral-800 rounded-2xl h-52 overflow-hidden md:col-span-2">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_0.2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative bg-[#1c1c1c] border border-neutral-800 rounded-2xl h-48 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_0.3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
              <div className="relative bg-[#1c1c1c] border border-neutral-800 rounded-2xl h-48 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_0.4s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Product Not Found ─────────────────────────────────────────── */}
        {notFound && !isLoading && (
          <div className="relative bg-[#1c1c1c] border border-orange-500/25 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-400 to-orange-500/0"></div>

            <div className="p-10 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                    <path d="M3 7v4a1 1 0 001 1h3" /><path d="M7 7V5" /><path d="M16 11V7" /><path d="M16 11h-2.5" />
                    <path d="M20 7v4a1 1 0 01-1 1h-1" />
                    <rect x="1" y="3" width="22" height="4" rx="1" />
                    <path d="M9 17H5a2 2 0 00-2 2v2" />
                    <path d="M15 21l2-2 2 2" />
                    <path d="M17 21v-8" />
                  </svg>
                </div>
                {/* Ping ring */}
                <span className="absolute inset-0 rounded-full border border-orange-400/30 animate-ping opacity-40"></span>
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">Product Not Found</h3>
              <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-1">
                The barcode you scanned is not in our food database.
              </p>
              <p className="text-xs text-neutral-600 max-w-xs">
                Try scanning another product or enter the barcode manually.
              </p>

              {/* Tips */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                {[
                  { icon: "🔢", tip: "Check barcode digits" },
                  { icon: "💡", tip: "Try a different angle" },
                  { icon: "🌍", tip: "Product may not be listed yet" },
                ].map((t, i) => (
                  <div key={i} className="bg-black/40 border border-neutral-800 rounded-xl p-3 flex flex-col items-center gap-1">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-xs text-neutral-400 text-center">{t.tip}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setNotFound(false); setBarcode(""); }}
                className="mt-6 px-6 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:text-orange-200 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── Server / Network Error ────────────────────────────────────── */}
        {errorMsg && !isLoading && (
          <div className="relative bg-[#1c1c1c] border border-red-500/25 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-500/0 via-red-400 to-red-500/0"></div>

            <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
              {/* Icon */}
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="text-red-400" size={28} />
              </div>

              <div className="grow text-center sm:text-left">
                <h3 className="font-extrabold text-lg text-white">Request Failed</h3>
                <p className="text-sm text-neutral-400 mt-1 leading-relaxed">{errorMsg}</p>
              </div>

              <button
                onClick={() => setErrorMsg("")}
                className="shrink-0 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ── Empty / Ready State ───────────────────────────────────────── */}
        {!product && !isLoading && !errorMsg && !notFound && (
          <div className="relative bg-[#1c1c1c]/60 border border-dashed border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-14 flex flex-col items-center text-center">
              {/* Animated icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/8 border border-emerald-500/20 flex items-center justify-center">
                  <Scan className="text-emerald-500/60" size={36} />
                </div>
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse"></div>
              </div>

              <h3 className="text-xl font-extrabold text-neutral-200 mb-2">Ready to Scan</h3>
              <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                Enter a barcode number, upload an image, or use the live camera
                scanner to instantly fetch ingredients &amp; health analysis.
              </p>

              {/* Feature pills */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  { icon: "🔍", label: "Manual Barcode" },
                  { icon: "📷", label: "Live Camera" },
                  { icon: "🖼️", label: "Upload Image" },
                  { icon: "⚡", label: "Instant Analysis" },
                ].map((f, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-neutral-800/60 border border-neutral-700 text-neutral-400 flex items-center gap-1.5">
                    <span>{f.icon}</span>{f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Details Section */}
        {product && !isLoading && (
          <div className="space-y-6">
            {/* 1. Main Header Card */}
            <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-emerald-500 via-yellow-500 to-red-500"></div>

              {/* Product Image */}
              <div className="w-32 h-32 bg-black border border-neutral-800 rounded-xl overflow-hidden flex items-center justify-center p-2 shrink-0">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Info Column */}
              <div className="grow text-center md:text-left">
                <div className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                  {product.brand || "Unknown Brand"} •{" "}
                  {product.category || "Food Item"}
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1 leading-tight">
                  {product.productName}
                </h2>
                <div className="text-sm text-neutral-500 mt-1">
                  Serving Size:{" "}
                  <span className="text-neutral-400">
                    {product.servingSize}
                  </span>{" "}
                  | Barcode:{" "}
                  <span className="text-neutral-400">{product.barcode}</span>
                </div>
              </div>

              {/* Favorites Button */}
              <div className="shrink-0">
                <button
                  onClick={addToFavorites}
                  disabled={isFavoriting}
                  className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white p-3 rounded-xl flex items-center gap-2 transition cursor-pointer text-sm font-semibold"
                >
                  {isFavoriting ? (
                    <RefreshCw
                      className="animate-spin text-emerald-400"
                      size={16}
                    />
                  ) : (
                    <Heart
                      className="fill-transparent text-emerald-400"
                      size={16}
                    />
                  )}
                  Favorite
                </button>
              </div>
            </div>

            {/* 2. Side-By-Side Nutrition / Health Score Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Health Score Card */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] md:col-span-1 flex flex-col justify-between items-center text-center">
                <div className="w-full border-b border-neutral-800/80 pb-3 mb-4">
                  <h3 className="font-bold text-base text-neutral-200">
                    Health Rating
                  </h3>
                </div>

                {/* Score Indicator */}
                <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-neutral-800 bg-black shadow-inner">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                      {product.healthAnalysis.score}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono block">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border ${
                      product.healthAnalysis.status === "Healthy"
                        ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                        : product.healthAnalysis.status === "Unhealthy"
                          ? "text-red-500 border-red-500/30 bg-red-500/10"
                          : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                    }`}
                  >
                    {product.healthAnalysis.status} Product
                  </span>
                </div>

                {/* Recommendation */}
                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                  {product.healthAnalysis.recommendations}
                </p>
              </div>

              {/* Right Column: Nutriments Metrics */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] md:col-span-2">
                <div className="border-b border-neutral-800/80 pb-3 mb-4 flex justify-between items-center">
                  <h3 className="font-bold text-base text-neutral-200">
                    Nutrients (Per 100g)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    Nutrition Grade: {product.productGrade}
                  </span>
                </div>

                {/* Nutrient grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(product.nutrition).map(([key, value]) => {
                    const isWarningVal =
                      (key === "sugar" && value > 15) ||
                      (key === "fat" && value > 20) ||
                      (key === "salt" && value > 1.5) ||
                      (key === "sodium" && value > 500);

                    const isPositiveVal =
                      (key === "protein" && value > 10) ||
                      (key === "fiber" && value > 5);

                    return (
                      <div
                        key={key}
                        className="bg-black/60 border border-neutral-850 p-3 rounded-xl flex flex-col items-center justify-center text-center transition hover:border-neutral-700"
                      >
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                          {key}
                        </span>
                        <span
                          className={`text-lg font-bold mt-1 ${
                            isWarningVal
                              ? "text-red-500"
                              : isPositiveVal
                                ? "text-emerald-400"
                                : "text-neutral-200"
                          }`}
                        >
                          {value}
                          <span className="text-xs font-normal text-neutral-500 ml-0.5">
                            {key === "calories" || key === "energy"
                              ? " kcal"
                              : key === "sodium"
                                ? " mg"
                                : " g"}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Pros, Cons & Ingredients list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros & Cons / Recommendations */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                <h3 className="font-bold text-base text-neutral-200 border-b border-neutral-800/80 pb-3 mb-4">
                  Rule Analysis Insights
                </h3>

                <div className="space-y-4">
                  {/* Pros */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">
                      Pros / Positive Qualities
                    </h4>
                    {product.healthAnalysis.pros.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {product.healthAnalysis.pros.map((pro, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-neutral-200"
                          >
                            <CheckCircle2
                              className="text-emerald-400 shrink-0"
                              size={15}
                            />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic">
                        No significant positive qualities detected.
                      </p>
                    )}
                  </div>

                  {/* Cons */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">
                      Cons / Excess Nutrients
                    </h4>
                    {product.healthAnalysis.cons.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {product.healthAnalysis.cons.map((con, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-neutral-200"
                          >
                            <XCircle
                              className="text-red-500 shrink-0"
                              size={15}
                            />
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic">
                        No high-risk excess nutrients.
                      </p>
                    )}
                  </div>

                  {/* Warnings */}
                  {product.healthAnalysis.warnings.length > 0 && (
                    <div className="mt-2 bg-red-950/20 border border-red-500/25 p-3 rounded-xl">
                      <h4 className="text-xs uppercase font-extrabold text-red-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Warnings & Allergens
                      </h4>
                      <ul className="list-disc pl-4 text-xs text-red-300 space-y-1">
                        {product.healthAnalysis.warnings.map((warn, index) => (
                          <li key={index}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients Card */}
              <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
                <h3 className="font-bold text-base text-neutral-200 border-b border-neutral-800/80 pb-3 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-400" />{" "}
                  Ingredients List
                </h3>
                <div className="bg-black/60 rounded-xl p-4 border border-neutral-850 max-h-56 overflow-y-auto scrollbar-thin">
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    {product.ingredients}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
