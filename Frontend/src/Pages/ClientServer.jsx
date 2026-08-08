import React from "react";
import axios from "axios";

const ClientServer = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "https://scan-app-production-27e6.up.railway.app/",
  // baseURL: "https://scan-app-exix.vercel.app/",
  withCredentials: true,
});

export default ClientServer;