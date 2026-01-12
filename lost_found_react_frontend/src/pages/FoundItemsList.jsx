import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./FoundItemsList.css"; // Import normal CSS

const ViewFoundItems = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/found-items");
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching found items:", err);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="found-container">
      <h2 className="found-title">📌 Reported Found Items</h2>
      <div className="found-grid">
        {items.length === 0 ? (
          <p>No found items reported yet.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="found-card">
              {item.imagePath && (
                <img
                  src={`http://localhost:5000/${item.imagePath}`}
                  alt={item.itemName}
                  className="found-image"
                />
              )}
              <h3 className="found-name">{item.itemName}</h3>
              <p className="found-desc">{item.description}</p>
              <p className="found-location">📍 {item.location}</p>
              <p className="found-date">
                🗓 {new Date(item.dateFound).toLocaleDateString()}
              </p>
              <div className="found-buttons">
                <button
        className="btn home-btn"
        type="button"
        onClick={() => navigate("/dashboard")}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "orangered",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Home
      </button>
                 {/* Chat with Owner Button */}
                      <Link   className="btn chat-btn"
                        to={`/chat/${item._id}`} // Pass Lost Item ID to Chat page
                        style={{
                          display: "inline-block",
                          marginTop: "10px",
                          marginLeft: "10px",
                          padding: "10px 20px",
                          backgroundColor: "darkblue",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "5px",
                        }}
                      >
                        Chat with Owner
                      </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewFoundItems;
