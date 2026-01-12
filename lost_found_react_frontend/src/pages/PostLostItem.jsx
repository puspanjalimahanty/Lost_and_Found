// src/pages/PostLostItem.jsx
import React, { useState } from "react";
import axios from "../utils/axios";
import "./PostLostItem.css";
import { useNavigate } from "react-router-dom";

const PostLostItem = () => {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("dateLost", dateLost);
    formData.append("location", location);
    formData.append("image", image); // must match multer field name

    try {
      await axios.post("/lost-items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Lost item posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "❌ Failed to post lost item:",
        err.response?.data || err.message
      );
      alert("Failed to post lost item");
    }
  };

  return (
    <div className="post-lost-container">
      <h2>Post Lost Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="date"
          value={dateLost}
          onChange={(e) => setDateLost(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Post Item</button>
      </form>

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/dashboard")}>
        Back to Home
      </button>
    </div>
  );
};

export default PostLostItem;
