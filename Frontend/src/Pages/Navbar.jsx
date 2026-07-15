import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-50">
      <div className="flex justify-between  border-2 m-3 mt-3 rounded-2xl border-black shadow-[0_8px_20px_rgba(0,0,0,0.6)]  items-center py-4 px-6 ">
        {/* Logo */}
        <div className="font-bold text-2xl flex items-center whitespace-nowrap gap-2">
          <span>Scan</span> <span className="text-yellow-600">App</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 px-10 text-lg">
          <Link to="/" className=" hover:text-cyan-400 transition ">
            DashBoard
          </Link>
          <Link to="/login" className=" hover:text-cyan-400 transition ">
            Login
          </Link>
          <Link to="/register" className=" hover:text-cyan-400 transition ">
            Register
          </Link>
          <Link to="/camera" className=" hover:text-cyan-400 transition ">
            Camera
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center transform-none! filter-none! shadow-none! text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-[#0c0f16]/95 backdrop-blur-md rounded-xl ml-3 mr-4 px-6 shadow-xl transition-all duration-300  ${isOpen ? "block py-6" : "hidden"}`}
      >
        <div className="flex flex-col text-lg gap-4 text-neutral-200">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className=" hover:text-cyan-400 transition "
          >
            DashBoard
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className=" hover:text-cyan-400 transition "
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className=" hover:text-cyan-400 transition "
          >
            Register
          </Link>
          <Link
            to="/camera"
            onClick={() => setIsOpen(false)}
            className=" hover:text-cyan-400 transition "
          >
           Camera
          </Link>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;