import React from "react";
import Navbar from "./Pages/Navbar";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";

const App = () => {
  return (
    <div>
      <Navbar/>
      
     <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
     </Routes>
    </div>
  );
};

export default App;
