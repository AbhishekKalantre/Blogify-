import express from "express";
import {
  createTag,
  getAllTags,
  getTag,
  updateTag,
  deleteTag,
  getTagUsageCount,
} from "../controllers/tagController.js";

const router = express.Router();

// Create a new tag
router.post("/", createTag);

// Get all tags
router.get("/", getAllTags);

// Get tag usage count
router.get("/usage", getTagUsageCount);

// Get a single tag
router.get("/:id", getTag);

// Update a tag
router.put("/:id", updateTag);

// Delete a tag
router.delete("/:id", deleteTag);

export default router;
