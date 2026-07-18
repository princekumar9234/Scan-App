import React from "react";
import axios from "axios";

const ClientServer = axios.create({
  baseURL: "https://scan-app-production-de58.up.railway.app/",
  // baseURL: "http://localhost:3000/",
  withCredentials: true,
});

export default ClientServer;