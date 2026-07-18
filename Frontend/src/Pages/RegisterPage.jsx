import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import ClientServer from "./ClientServer";
import Navbar from "./Navbar";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConformPassword, setShowConformPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");

  const handleForm = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    ClientServer.post("/register", {
      username,
      email,
      password,
    })
      .then((res) => {
        alert(res.data.message);
        // console.log(res)
        navigate("/login");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alert(error.response.data.message);
        } else if (error.response.status === 400) {
          // console.log(error.response.data.error.map((e) => e.msg))
          alert(error.response.data.error.map((e) => e.msg));
        } else {
          console.log(error);
          alert("Please try again Check Your internet Connections !");
        }
      });
  };
  return (
    <div>
      <Navbar />

      <form
        onSubmit={(e) => {
          handleForm(e);
        }}
        className="mt-2 ml-6 md:ml-[35%] w-fit m-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] bg-[#1c1c1c]"
      >
        <div className="  p-7 pb-3 gap-1 mt-6  flex flex-col">
          <h4 className="mt-2 opacity-90 text-center mb-3 text-lg font-bold">
            Create a new Account
          </h4>
          <h4 className="mt-2 opacity-60 text-sm font-bold">Your Name</h4>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={username}
            type="text"
            placeholder="Enter your Full name"
            className="p-3 bg-black rounded-xl text-sm focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] focus:border-emerald-300 focus:border opacity-60 outline-none  "
          />
          <h4 className="mt-2 opacity-60 text-sm font-bold">Your Email</h4>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Enter your email "
            className="p-3 bg-black rounded-xl text-sm focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] focus:border-emerald-300 focus:border opacity-60 outline-none  "
          />
          <h4 className="mt-2 opacity-60 text-sm font-bold">Password</h4>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type={showPassword ? "text " : "password"}
            placeholder="Enter your Password"
            className=" p-3 bg-black rounded-xl text-sm focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] focus:border-emerald-300 focus:border opacity-60 outline-none  "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // click handler to toggle state
            className="absolute bottom-80 right-19 md:right-[38%]  md:bottom-64 text-emerald-600 hover:text-emerald-400 focus:outline-none cursor-pointer flex items-center justify-center"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <h4 className="mt-3 opacity-60 text-sm font-bold">
            Conform Password
          </h4>
          <input
            onChange={(e) => {
              setConformPassword(e.target.value);
            }}
            value={conformPassword}
            type={showConformPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="p-3 bg-black rounded-xl  text-sm focus:border-emerald-300 focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] focus:border opacity-60 outline-none  "
          />

          <button
            type="button"
            onClick={() => setShowConformPassword(!showConformPassword)} // click handler to toggle state
            className="absolute bottom-101 right-22 md:right-[38%] md:bottom-43 focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] text-emerald-500 focus:outline-none cursor-pointer flex items-center justify-center"
          >
            {showConformPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          <button className="px-29 md:px-33 mt-6 py-3  bg-emerald-400 outline-none rounded focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] text-black font-bold text-sm shadow-[0_8px_20px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.6)] ">
            Create Account
          </button>
        </div>
        <div className="flex gap-2  justify-center pb-4 text-lg">
          You have an account ?
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="underline text-red-500"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
