import CommentModel from "../models/commentModel.js";
import {
  createCommentQuery,
  getCommentsByPostQuery,
} from "../services/commentService.js";

export const createComment = async (req, res) => {
  try {
    console.log("Received comment data:", req.body);
    let { postId, postType, name, email, content } = req.body;

    // Ensure postId is present
    if (!postId) {
      console.log("Missing postId, generating a temporary one");
      // Generate a temporary postId if missing
      postId = Date.now();
    }

    // Ensure other required fields
    if (!postType || !name || !email || !content) {
      console.log("Missing fields:", {
        postId,
        postType,
        name,
        email,
        content,
      });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const comment = new CommentModel({
      postId,
      postType,
      name,
      email,
      content,
    });

    console.log("Created comment model:", comment);
    const response = await createCommentQuery(comment);
    console.log("Database response:", response);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Comment Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    console.log("Fetching comments for:", req.params);
    const { postId, postType } = req.params;

    if (!postId || !postType) {
      return res.status(400).json({
        success: false,
        message: "Post ID and type are required",
      });
    }

    const response = await getCommentsByPostQuery(postId, postType);
    console.log("Comments fetched:", response.data);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Get Comments Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
