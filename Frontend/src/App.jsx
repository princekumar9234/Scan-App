import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import HomePage from "./Components/Homes/HomePage";
import ScanPage from "./Pages/ScanPage";
import HistoryPage from "./Pages/HistoryPage";
import FavoritesPage from "./Pages/FavoritesPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1c1c1c",
            color: "#e5e7eb",
            border: "1px solid #27272a",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#1c1c1c",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1c1c1c",
            },
          },
        }}
      />
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
