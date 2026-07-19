import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Scan,
  History,
  Star,
  Home,
  ChevronDown,
  ScanLine,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientServer from "../../Pages/ClientServer";

const HomeNav = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Desktop aur mobile ke liye alag-alag refs — ek ref dono ko track nahi kar sakta
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored
        ? JSON.parse(stored)
        : { username: "User", email: "user@email.com" };
    } catch {
      return { username: "User", email: "user@email.com" };
    }
  });

  const LogoutUser = () => {
    ClientServer.post("/logout").then((res) => {
      alert(res.data.message);
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

  // Close dropdown when clicking outside — dono refs check karo
  useEffect(() => {
    const handleClickOutside = (event) => {
      const insideDesktop =
        desktopDropdownRef.current &&
        desktopDropdownRef.current.contains(event.target);
      const insideMobile =
        mobileDropdownRef.current &&
        mobileDropdownRef.current.contains(event.target);

      if (!insideDesktop && !insideMobile) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative z-50">
      <div className="flex justify-between border-2 m-3 mt-3 rounded-2xl border-black bg-[#0c0f16]/90 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.6)] items-center py-4 px-4 md:px-6">
        {/* Welcome Section */}
        <div className="font-bold flex items-center whitespace-nowrap gap-2">
          <span className="text-lg md:text-2xl">Welcome,</span>
          <span className="text-yellow-600 md:text-xl text-lg">
            {user.username}
          </span>
        </div>

        {/* ===== DESKTOP MENU ===== */}
        <div className="hidden md:flex items-center space-x-6 text-base lg:text-lg">
          <Link
            to="/homepage"
            className="hover:text-cyan-400 transition flex items-center gap-1.5 font-semibold text-neutral-300"
          >
            <Home size={18} /> Home
          </Link>
          <Link
            to="/scan"
            className="hover:text-cyan-400 transition flex items-center gap-1.5 font-semibold text-neutral-300"
          >
            <ScanLine size={18} /> Scan Product
          </Link>

          <div className="h-6 w-px bg-neutral-800"></div>

          {/* Profile Dropdown — Desktop */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-[#1c1c1c] border border-neutral-800 rounded-full py-1.5 px-3 hover:border-emerald-500 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-sm">
                {user.username.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-neutral-200">
                {user.username}
              </span>
              <ChevronDown
                size={14}
                className={`text-neutral-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Box — Desktop */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0c0f16] border border-neutral-800 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-base shrink-0">
                    {user.username.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-200 truncate">
                      {user.username}
                    </h4>
                    <p className="text-xs text-neutral-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/history"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <History size={16} /> History
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <Star size={16} />Favorites
                  </Link>
                  <Link
                    to="/scan"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <ScanLine size={16} /> Scan Product
                  </Link>
                  <Link
                    to="/homepage"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <Home size={16} /> Home
                  </Link>
                </div>

                <div className="h-px bg-neutral-800/80 my-3"></div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    LogoutUser();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 transition text-sm font-bold cursor-pointer"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            to="/homepage"
            className="hover:text-cyan-400 transition flex items-center font-semibold text-neutral-300"
          >
            <Home />
          </Link>
          <Link
            to="/scan"
            className="hover:text-cyan-400 transition flex items-center text-xl font-semibold text-neutral-300"
          >
            <ScanLine />
          </Link>

          {/* Profile Dropdown — Mobile */}
          <div className="relative" ref={mobileDropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 border-neutral-800 rounded-full hover:border-emerald-500 transition cursor-pointer"
            >
              <div className="px-3 py-2 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-sm">
                {user.username.charAt(0)}
              </div>
            </button>

            {/* Dropdown Box — Mobile */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0c0f16] border border-neutral-800 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-base shrink-0">
                    {user.username.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-200 truncate">
                      {user.username}
                    </h4>
                    <p className="text-xs text-neutral-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/history"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <History size={16} /> History
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <Star size={16} />
                    Favorites
                  </Link>
                  <Link
                    to="/homepage"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <Home size={16} />
                    Home
                  </Link>
                  <Link
                    to="/scan"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <ScanLine size={16} />
                    Scan
                  </Link>
                </div>

                <div className="h-px bg-neutral-800/80 my-3"></div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    LogoutUser();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 transition text-sm font-bold cursor-pointer"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;
