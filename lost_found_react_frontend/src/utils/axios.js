// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://findmystuff-backend.onrender.com/api", // adjust as needed
});

export default instance;
