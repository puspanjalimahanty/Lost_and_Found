// src/pages/LostItemDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LostItemDetail = () => {
  const { id } = useParams(); // Lost Item ID from URL
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        console.log("Fetching item with ID:", id);
        const res = await axios.get(`http://localhost:5000/api/lost-items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <p>Loading item...</p>;
  }

  return (
    <div className="item-detail-container">
      <h2>{item.itemName}</h2>
      <img
        src={
          item.imagePath
            ? `http://localhost:5000/${item.imagePath}`
            : "https://via.placeholder.com/150"
        }
        alt={item.itemName}
        style={{ maxWidth: "300px", margin: "10px 0" }}
      />
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date Lost:</strong> {new Date(item.dateLost).toLocaleDateString()}</p>

      {/* Report Found Button */}
      <button
        onClick={() => navigate("/post-found")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Report Found
      </button>

      {/* Go to Dashboard Button */}
      <button
        className="go-home-button"
        type="button"
        onClick={() => navigate("/dashboard")}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go to Homepage
      </button>

      {/* Chat with Owner Button */}
      <Link
        to={`/chat/${item._id}`} // Pass Lost Item ID to Chat page
        style={{
          display: "inline-block",
          marginTop: "10px",
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Chat with Owner
      </Link>
    </div>
  );
};

export default LostItemDetail;
