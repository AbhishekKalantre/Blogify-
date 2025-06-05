import express from "express";
import cors from "cors";
import { checkConnection } from "./config/db.js";
import createAllTables from "./utils/dbUtils.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created at:", uploadsDir);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

// all routes here
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/profile", profileRoutes);

app.listen(3000, async () => {
  console.log("Server is running on port 3000");

  try {
    await checkConnection();
    await createAllTables();
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
});
