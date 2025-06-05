import TagModel from "../models/tagModel.js";
import {
  createTagQuery,
  getAllTagsQuery,
  getTagQuery,
  updateTagQuery,
  deleteTagQuery,
  getTagUsageCountQuery,
} from "../services/tagService.js";

// Create a new tag
export const createTag = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const tag = new TagModel({
      name,
      description,
      color,
    });

    const response = await createTagQuery(tag);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("Create Tag Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all tags
export const getAllTags = async (req, res) => {
  try {
    const response = await getAllTagsQuery();
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Get Tags Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a single tag
export const getTag = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getTagQuery(id);
    return res.status(response.success ? 200 : 404).json(response);
  } catch (error) {
    console.error("Get Tag Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a tag
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const tag = {
      name,
      description,
      color,
    };

    const response = await updateTagQuery(id, tag);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Update Tag Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a tag
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteTagQuery(id);
    return res.status(response.success ? 200 : 404).json(response);
  } catch (error) {
    console.error("Delete Tag Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get tag usage count
export const getTagUsageCount = async (req, res) => {
  try {
    const response = await getTagUsageCountQuery();
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Get Tag Usage Count Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
