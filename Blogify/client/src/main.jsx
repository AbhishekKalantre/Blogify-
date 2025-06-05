import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Configure axios to use the API base URL
axios.defaults.baseURL = "http://localhost:3000";

// Add interceptor to handle image URLs in responses
axios.interceptors.response.use((response) => {
  // Process response to handle image URLs
  if (response.data && response.data.data) {
    if (Array.isArray(response.data.data)) {
      // Handle array of items (lists)
      response.data.data = response.data.data.map((item) => {
        // Handle image URLs
        if (item.imageUrl && item.imageUrl.startsWith("/uploads/")) {
          item.imageUrl = `${axios.defaults.baseURL}${item.imageUrl}`;
        }
        // Handle profile picture URLs
        if (
          item.profile_picture &&
          item.profile_picture.startsWith("/uploads/")
        ) {
          item.profile_picture = `${axios.defaults.baseURL}${item.profile_picture}`;
        }
        return item;
      });
    } else if (typeof response.data.data === "object") {
      // Handle single item
      if (
        response.data.data.imageUrl &&
        response.data.data.imageUrl.startsWith("/uploads/")
      ) {
        response.data.data.imageUrl = `${axios.defaults.baseURL}${response.data.data.imageUrl}`;
      }
      // Handle profile picture URL
      if (
        response.data.data.profile_picture &&
        response.data.data.profile_picture.startsWith("/uploads/")
      ) {
        response.data.data.profile_picture = `${axios.defaults.baseURL}${response.data.data.profile_picture}`;
      }
    }
  }
  return response;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
