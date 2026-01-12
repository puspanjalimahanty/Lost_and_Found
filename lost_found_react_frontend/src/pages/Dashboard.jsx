// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import  {useRef} from "react";



const Dashboard = () => {
  const navigate = useNavigate();
  const profileRef = useRef();

  const [lostItems, setLostItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
const [showProfileCard, setShowProfileCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  



useEffect(() => {
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileCard(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);




  useEffect(() => {
    const token = localStorage.getItem("token");

   if (token) {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    setUserName(decoded.name);   // ✅ name from token
    setUserEmail(decoded.email); // ✅ email from token
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}


    const fetchLostItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/lost-items");
        setLostItems(response.data);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    fetchLostItems();
  }, []);

const filteredItems = lostItems.filter((item) =>
  item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.location.toLowerCase().includes(searchQuery.toLowerCase())
);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <h2 className="logo">FindMyStuff</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/Dashboard")}>Home</li>
            <li onClick={() => navigate("/post-lost")}>Report Lost</li>
            <li onClick={() => navigate("/post-found")}>Report Found</li>
            <li onClick={() => navigate("/found-items")}>View Found Items</li>
          </ul>
        </nav>

       <div className="profile-container" onClick={() => setShowProfileCard(x => !x)}>
  <div className="profile-icon">👤</div>

  {showProfileCard && (
    <div className="profile-card" ref={profileRef}>
      <p><strong>{userName}</strong></p>
      <p className="email">{userEmail}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
</div>


      </header>

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

      <section className="items-preview">
        {lostItems.length === 0 ? (
  <p style={{ textAlign: "center", width: "100%" }}>No lost items posted yet.</p>
) : filteredItems.length === 0 ? (
  <p style={{ textAlign: "center", width: "100%" }}>🔍 No matching items found.</p>
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
            ? `http://localhost:5000/${item.imagePath}`
            : "https://via.placeholder.com/50"
        }
        alt={item.itemName}
      />
      <h3>{item.itemName}</h3>
      <p>{item.description}</p>
      <p style={{ fontSize: "0.9rem", color: "#555" }}>📍 {item.location}</p>
      <p style={{ fontSize: "0.8rem", color: "#888" }}>
        🕒 {new Date(item.dateLost).toLocaleDateString()}
      </p>
    </div>
  ))
)}

      </section>

      <footer>
        <p>© 2025 FindMyStuff Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
