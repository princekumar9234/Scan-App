import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, User, Mail, Lock } from "lucide-react";
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
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status === 409) {
          alert(error.response.data.message);
        } else if (error?.response?.status === 400) {
          alert(error.response.data.error.map((e) => e.msg));
        } else {
          alert("Something went wrong. Please check your internet connection!");
        }
      });
  };

  return (
    <div className=" bg-[#0F172A] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 mb-4">
                <UserPlus size={24} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Create Account
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Start scanning smarter today
              </p>
            </div>

            <form onSubmit={handleForm} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-400">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={username}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 focus:border-emerald-400 outline-none focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl text-sm text-gray-200 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-400">
                  Your Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 focus:border-emerald-400 outline-none focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl text-sm text-gray-200 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-400">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-black border border-neutral-800 focus:border-emerald-400 outline-none focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl text-sm text-gray-200 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-emerald-400 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    onChange={(e) => setConformPassword(e.target.value)}
                    value={conformPassword}
                    type={showConformPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-black border border-neutral-800 focus:border-emerald-400 outline-none focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl text-sm text-gray-200 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConformPassword(!showConformPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-emerald-400 transition cursor-pointer"
                  >
                    {showConformPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus size={18} />
                Create Account
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-neutral-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer transition"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
