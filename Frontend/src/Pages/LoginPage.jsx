import React, { useState } from "react";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientServer from "./ClientServer";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    ClientServer.post("/login", {
      email,
      password,
    })
      .then((res) => {
        console.log(res);
        alert(res.data.message);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        navigate("/homepage");
      })
      .catch((error) => {
        console.log(error);
        // error.response undefined hoga jab network/CORS error ho
        const message =
          error?.response?.data?.message ||
          "Something went wrong. Please try again.";
        alert(message);
        setEmail("");
        setPassword("");
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
                <LogIn size={24} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Welcome Back
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleForm} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-400">
                  Email Address
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
                    name="email"
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
                    name="password"
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

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn size={18} />
                Log In
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-neutral-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer transition"
              >
                Register now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
