import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import HomePage from "./Components/Homes/HomePage";
import ScanPage from "./Pages/ScanPage";
import HistoryPage from "./Pages/HistoryPage";
import FavoritesPage from "./Pages/FavoritesPage";
// import LiquidEther from "./Components/Background/LiquidEther";

const App = () => {
  return (
    <div>
      {/* <div style={{ width: "100%", height: 600, position: "relative" }}>
              <LiquidEther
                colors={["#5227FF", "#FF9FFC", "#B497CF"]}
                mouseForce={20}
                cursorSize={100}
                isViscous
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.5}
                isBounce={false}
                autoDemo
                autoSpeed={0.5}
                autoIntensity={2.2}
                takeoverDuration={0.25}
                autoResumeDelay={3000}
                autoRampDuration={0.6}
                color0="#5227FF"
                color1="#FF9FFC"
                color2="#B497CF"
              />
            </div> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </div>
  );
};

export default App;
