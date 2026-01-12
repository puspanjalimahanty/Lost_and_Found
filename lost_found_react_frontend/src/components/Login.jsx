import React, { useState } from "react";
import axios from "../utils/axios"; 

import "./Login.css"; // CSS file we'll define below
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", formData);

      console.log("✅ Logged in:", res.data);
      alert("Login successful!");
      const token = res.data.token;
      localStorage.setItem("token", token);
       navigate("/dashboard"); 
      // Optionally save token or redirect here
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p>New User ?</p>
        <Link to="/register">
  <button type="button" >Register Now</button>
</Link>
      </form>
    </div>
  );
};

export default Login;
