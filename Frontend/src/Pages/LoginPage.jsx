import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientServer from "./ClientServer";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        navigate("/homepage");
      })
      .catch((error) => {
        console.log(error.response);
        console.log(error.response.data.message);
        alert(error.response.data.message);
        setEmail("");
        setPassword("");
      });
  };

  return (
    <div>
      <Navbar />
      <form
        onSubmit={(e) => {
          handleForm(e);
        }}
        className="flex flex-col justify-center items-center  mt-22 "
      >
        <div className="flex flex-col gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.6)] p-7 rounded-xl border-black bg-[#1c1c1c]">
          <h2 className="text-center text-lg font-bold mb-4">Welcome Back </h2>
          <h4 className="text-sm text-gray-300 opacity-65">Email Address</h4>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="text"
            name="email"
            placeholder="Enter your Email"
            className="p-3  bg-black focus:border opacity-65 outline-none focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] focus:border-emerald-400 rounded-xl text-sm "
          />
          <h4 className="mt-2 text-sm text-gray-300 opacity-65">Psssword</h4>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            name="pasword "
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="p-3  bg-black text-sm opacity-65  rounded-xl focus:border  focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] outline-none focus:border-emerald-400 "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // click handler to toggle state
            className="absolute bottom-104 right-27 md:right-[38%] md:bottom-67 focus:shadow-[0_8px_20px_rgba(2,180,120,0.2)] text-emerald-600 hover:text-emerald-400 focus:outline-none cursor-pointer flex items-center justify-center"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          <button className="p-2   rounded bg-emerald-400 transition-all shadow-[0_8px_20px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.6)]  text-black mt-4 font-bold cursor-pointer ">
            Log in
          </button>
          <div className="mt-3  md:px-12 gap-2 flex opacity-80 justify-center">
            Don't have an account ?
            <button
              className="text-red-500 cursor-pointer underline font-bold"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register now
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
