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
    <nav className="relative md:z-50">
      <div className="flex justify-between  border-2 m-3 mt-3 rounded-2xl border-black shadow-[0_8px_20px_rgba(0,0,0,0.6)]  items-center py-4 px-2 md:px-6 ">
        {/* Logo */}
        <div className="font-bold flex  text-center items-baseline whitespace-nowrap ">
          <span className="text-lg md:text-2xl px-2">Welcome ,</span>
          <span className="text-yellow-600 md:text-xl text-sm">User</span>
        </div>

        {/* Desktop Menu */}
        <div className=" flex items-center gap-4 md:gap-6 px-1  text-lg ">
          <Link
            to="#"
            className="  transition bg-white text-black font-extrabold rounded-full px-2"
          >
            P
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
