import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    console.log(email, password);
    setEmail("");
    setPassword("");
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          handleForm(e);
        }}
        className="flex flex-col justify-center items-center  mt-22 "
      >
        <div className="flex flex-col gap-2 border-2 p-7 rounded-xl border-black bg-[#1c1c1c]">
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
            className="p-3  bg-black focus:border opacity-65 outline-none focus:border-emerald-400 rounded-xl text-sm "
          />
          <h4 className="mt-2 text-sm text-gray-300 opacity-65">Psssword</h4>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="text"
            name="pasword "
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="p-3  bg-black text-sm opacity-65  rounded-xl focus:border  outline-none focus:border-emerald-400 "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // click handler to toggle state
            className="absolute bottom-68 right-27 md:right-[38%] md:bottom-70 text-emerald-600 hover:text-emerald-400 focus:outline-none cursor-pointer flex items-center justify-center"
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
