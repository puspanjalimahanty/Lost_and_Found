import React, { useState } from "react";
import axios from "../utils/axios";
import './PostFoundItem.css';
import { useNavigate } from "react-router-dom";

const PostFoundItems = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
    dateFound: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      return setMessage("User not authenticated.");
    }

    try {
      const data = new FormData();
      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("dateFound", formData.dateFound);
      if (image) {
        data.append("image", image);
      }
                  
      const response = await axios.post(
       "/found-items",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Found item posted successfully!");
      setFormData({
        itemName: "",
        description: "",
        location: "",
        dateFound: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error posting found item:", error);
      setMessage("❌ Failed to post found item");
    }
  };

  return (
    <div className="post-container">
      <h2 className="form-title">Post Found Item</h2>

      {message && <p className="form-message">{message}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
          required
          className="form-input"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-textarea"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="form-input"
        />

        <input
          type="date"
          name="dateFound"
          value={formData.dateFound}
          onChange={handleChange}
          required
          className="form-input"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-file"
        />

        <button type="submit" className="form-button">
          Submit
        </button>
      </form>
      <button className="form-button"
      style={{ marginTop: "20px" }}
      onClick={() => navigate("/dashboard")}
    >
      Back to Home
    </button>
    </div>
  );
};

export default PostFoundItems;
