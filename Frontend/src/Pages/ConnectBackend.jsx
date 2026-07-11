import React from 'react';
import axios from "axios"

export const ConnectBackend = axios.create({
  baseURL: "http://localhost:8080",
});