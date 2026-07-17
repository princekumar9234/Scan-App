import React from "react";
import axios from "axios";

const ClientServer = axios.create({
  baseURL: "http://localhost:3000",
});

export default ClientServer;