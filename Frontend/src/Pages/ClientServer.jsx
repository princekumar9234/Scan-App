import React from "react";
import axios from "axios";

const ClientServer = axios.create({
  baseURL: "https://scan-app-production-6816.up.railway.app/",
});

export default ClientServer;