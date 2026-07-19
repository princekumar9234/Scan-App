import React from "react";
import axios from "axios";

const ClientServer = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "https://scan-app-production-27e6.up.railway.app/",
  withCredentials: true,
});

export default ClientServer;