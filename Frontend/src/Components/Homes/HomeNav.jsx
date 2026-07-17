import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

import { useNavigate } from "react-router-dom";
import ClientServer from "../../Pages/ClientServer";

const HomeNav = () => {
  const navigae = useNavigate();

  const LogoutUser = () => {
    ClientServer.post("/logout").then((res) => {
      alert(res.data.message);
      console.log(res);
      navigae("/login");
    });
  };

  return (
    <nav className="relative z-50">
      <div className="flex justify-between  border-2 m-3 mt-3 rounded-2xl border-black shadow-[0_8px_20px_rgba(0,0,0,0.6)]  items-center py-4 px-6 ">
        {/* Logo */}
        <div className="font-bold flex  text-center items-baseline whitespace-nowrap gap-1">
          <span className="text-lg md:text-2xl">Welcome ,</span>{" "}
          <span className="text-yellow-600 md:text-xl text-sm">User</span>
        </div>

        {/* Desktop Menu */}
        <div className=" flex space-x-8 px-1 text-lg">
          <Link to="/logout" className=" hover:text-cyan-400 transition ">
            Profile
          </Link>

          <Link to="" className=" hover:text-cyan-400 transition ">
            <LogOut
              onClick={(e) => {
                LogoutUser(e);
              }}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;
