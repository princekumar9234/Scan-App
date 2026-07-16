import React from "react";
import Navbar from "./Pages/Navbar";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import Camera from "./Components/Homes/Camera";
import Main from "./Components/Homes/Main";
import { LogOut } from "lucide-react";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/main" element ={<Main/> } />
        <Route path="/logout" element ={<LogOut/> } />
      </Routes>
    </div>
  );
};

export default App;
