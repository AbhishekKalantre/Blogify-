import express from "express";
import {
  createComment,
  getCommentsByPost,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:postId/:postType", getCommentsByPost);

export default router;
