// utils/getUserFromToken.js
import jwt_decode from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwt_decode(token);
    return decoded; // contains userId, name, email
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
