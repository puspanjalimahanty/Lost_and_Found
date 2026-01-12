// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // adjust as needed
});

export default instance;
