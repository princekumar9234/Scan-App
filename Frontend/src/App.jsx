import React from "react";
import Navbar from "./Pages/Navbar";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";

const App = () => {
  return (
    <div>
      <Navbar/>
      
     <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
     </Routes>
    </div>
  );
};

export default App;
