import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, Scan, History, Star, Home, User, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientServer from "../../Pages/ClientServer";

const HomeNav = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { username: "User", email: "user@email.com" };
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

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
          <span className="text-yellow-600 md:text-xl text-sm">{user.username}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-base lg:text-lg">
          <Link to="/homepage" className="hover:text-cyan-400 transition flex items-center gap-1.5 font-semibold text-neutral-300">
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/scan" className="hover:text-cyan-400 transition flex items-center gap-1.5 font-semibold text-neutral-300">
            <Scan size={18} /> Scan Product
          </Link>

          <div className="h-6 w-px bg-neutral-800"></div>

          {/* Profile Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-[#1c1c1c] border border-neutral-800 rounded-full py-1.5 px-3 hover:border-emerald-500 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-sm">
                {user.username.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-neutral-200">{user.username}</span>
              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Profile Dropdown Box */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0c0f16] border border-neutral-800 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50">
                {/* Header: User Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-base shrink-0">
                    {user.username.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-200 truncate">{user.username}</h4>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Navigation Options */}
                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/history"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <History size={16} /> My Scan History
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900 transition text-sm font-medium"
                  >
                    <Star size={16} /> My Favorites
                  </Link>
                </div>

                <div className="h-px bg-neutral-800/80 my-3"></div>

                {/* Logout Action */}
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

        {/* Hamburger Button for Mobile */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-[#0c0f16]/98 backdrop-blur-md rounded-2xl ml-3 mr-4 p-5 shadow-2xl border border-neutral-800/80 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-4 text-neutral-200">
          <Link
            to="/homepage"
            onClick={() => setIsOpen(false)}
            className="hover:text-cyan-400 transition flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-900 font-semibold"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/scan"
            onClick={() => setIsOpen(false)}
            className="hover:text-cyan-400 transition flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-900 font-semibold"
          >
            <Scan size={18} /> Scan Product
          </Link>

          {/* User Profile sub-panel */}
          <div className="bg-[#131722] rounded-2xl p-4 border border-neutral-800 shadow-inner mt-1">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-extrabold flex items-center justify-center uppercase text-base shrink-0">
                {user.username.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-bold text-neutral-200 truncate">{user.username}</span>
                <span className="block text-xs text-neutral-500 truncate mt-0.5">{user.email}</span>
              </div>
            </div>

            {/* Links List */}
            <div className="flex flex-col gap-1.5">
              <Link
                to="/history"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-900 transition text-sm font-semibold text-neutral-300 hover:text-cyan-400"
              >
                <div className="flex items-center gap-2.5">
                  <History size={16} />
                  <span>Scan History</span>
                </div>
                <ChevronRight size={14} className="text-neutral-500" />
              </Link>

              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-900 transition text-sm font-semibold text-neutral-300 hover:text-cyan-400"
              >
                <div className="flex items-center gap-2.5">
                  <Star size={16} />
                  <span>Favorites</span>
                </div>
                <ChevronRight size={14} className="text-neutral-500" />
              </Link>
              
              <div className="h-px bg-neutral-800/80 my-2"></div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  LogoutUser();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-950/20 text-red-400 hover:text-red-300 transition text-sm font-bold cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut size={16} />
                  <span>Log Out</span>
                </div>
                <ChevronRight size={14} className="text-red-500/50" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;
