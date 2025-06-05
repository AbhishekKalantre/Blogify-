import express from "express";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createNewsArticle,
  getAllNewsArticles,
  getNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  createStory,
  getAllStories,
  getStory,
  updateStory,
  deleteStory,
  getRelatedPosts,
} from "../controllers/postController.js";

const router = express.Router();

// Related posts routes - placing these first to avoid conflicts with :id routes
router.get("/blog/related/:id", getRelatedPosts);
router.get("/news/related/:id", getRelatedPosts);
router.get("/story/related/:id", getRelatedPosts);

// Blog post routes
router.post("/blog", createBlogPost);
router.get("/blogs", getAllBlogPosts);
router.get("/blog/:id", getBlogPost);
router.put("/blog/:id", updateBlogPost);
router.delete("/blog/:id", deleteBlogPost);

// News article routes
router.post("/news", createNewsArticle);
router.get("/news", getAllNewsArticles);
router.get("/news/:id", getNewsArticle);
router.put("/news/:id", updateNewsArticle);
router.delete("/news/:id", deleteNewsArticle);

// Story routes
router.post("/story", createStory);
router.get("/stories", getAllStories);
router.get("/story/:id", getStory);
router.put("/story/:id", updateStory);
router.delete("/story/:id", deleteStory);

export default router;
