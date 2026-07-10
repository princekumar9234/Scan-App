import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      <div className="flex justify-between items-center py-4 px-6 ">
        {/* Logo */}
        <div className="font-bold text-2xl flex items-center whitespace-nowrap gap-1">
          <span>Scan</span> <span className="text-yellow-600">App</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 px-10 text-lg">
          <Link to="/login" className=" hover:text-cyan-400 transition ">
            Login
          </Link>
          <Link to="/register" className=" hover:text-cyan-400 transition ">
            Register
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center transform-none! filter-none! shadow-none!"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-[#f0f2f5] px-6 shadow-md ${isOpen ? "block py-4" : "hidden"}`}
      >
        <div className="flex flex-col text-lg gap-4">
          <Link to="/loginpage" className=" hover:text-cyan-400 transition ">
            Login
          </Link>
          <Link to="/registerpage" className=" hover:text-cyan-400 transition ">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
