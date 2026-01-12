// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const profileRef = useRef();

  const [lostItems, setLostItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔑 backend base URL (for images)
  const BACKEND_URL = process.env.REACT_APP_API_URL;

  /* ---------------- CLICK OUTSIDE PROFILE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- AUTH + FETCH DATA ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 Protect dashboard
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.name);
      setUserEmail(decoded.email);
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const fetchLostItems = async () => {
      try {
        const res = await axios.get("/lost-items");
        setLostItems(res.data);
      } catch (err) {
        console.error("Error fetching lost items:", err);
      }
    };

    fetchLostItems();
  }, [navigate]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredItems = lostItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="navbar">
        <h2 className="logo">FindMyStuff</h2>

        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>Home</li>
            <li onClick={() => navigate("/post-lost")}>Report Lost</li>
            <li onClick={() => navigate("/post-found")}>Report Found</li>
            <li onClick={() => navigate("/found-items")}>View Found Items</li>
          </ul>
        </nav>

        <div
          className="profile-container"
          onClick={() => setShowProfileCard((p) => !p)}
        >
          <div className="profile-icon">👤</div>

          {showProfileCard && (
            <div className="profile-card" ref={profileRef}>
              <p>
                <strong>{userName}</strong>
              </p>
              <p className="email">{userEmail}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <h1>Lost Something? Or Found an Item?</h1>
        <p>
          Use our platform to report or look up lost and found items. Let's
          reconnect things with their owners.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>Search</button>
        </div>
      </section>

      {/* ---------------- ITEMS ---------------- */}
      <section className="items-preview">
        {lostItems.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            No lost items posted yet.
          </p>
        ) : filteredItems.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            🔍 No matching items found.
          </p>
        ) : (
          filteredItems.map((item) => (
            <div
              className="item-card"
              key={item._id}
              onClick={() => navigate(`/lost-item/${item._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  item.imagePath
                    ? `${BACKEND_URL}/${item.imagePath}`
                    : "https://via.placeholder.com/150"
                }
                alt={item.itemName}
              />
              <h3>{item.itemName}</h3>
              <p>{item.description}</p>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                📍 {item.location}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                🕒 {new Date(item.dateLost).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer>
        <p>© 2025 FindMyStuff Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
