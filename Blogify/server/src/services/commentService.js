import { pool } from "../config/db.js";

export const createCommentQuery = async (comment) => {
  try {
    console.log("Comment service received:", comment);

    // Ensure postId is a number
    let postId;
    try {
      postId = parseInt(comment.postId, 10);
      if (isNaN(postId)) {
        // If it's not a valid number, use a hash of the string value
        postId = hashString(String(comment.postId));
      }
    } catch (e) {
      // If any error occurs, use a timestamp as fallback
      console.error("Error parsing postId, using timestamp as fallback:", e);
      postId = Date.now();
    }

    console.log("Using postId:", postId);

    const query = `INSERT INTO comments (post_id, post_type, name, email, content) VALUES (?, ?, ?, ?, ?);`;
    const values = [
      postId,
      comment.postType,
      comment.name,
      comment.email,
      comment.content,
    ];

    console.log("Executing query with values:", values);
    await pool.query(query, values);
    return { success: true, message: "Comment added successfully" };
  } catch (error) {
    console.error("Error adding comment: ", error);
    return { success: false, message: "Failed to add comment" };
  }
};

export const getCommentsByPostQuery = async (postId, postType) => {
  try {
    // Ensure postId is a number
    let parsedPostId;
    try {
      parsedPostId = parseInt(postId, 10);
      if (isNaN(parsedPostId)) {
        // If it's not a valid number, use a hash of the string value
        parsedPostId = hashString(String(postId));
      }
    } catch (e) {
      console.error("Error parsing postId for fetching comments:", e);
      return { success: false, message: "Invalid post ID" };
    }

    console.log("Fetching comments for postId:", parsedPostId);

    const query = `SELECT * FROM comments WHERE post_id = ? AND post_type = ? ORDER BY created_at DESC;`;
    const [rows] = await pool.query(query, [parsedPostId, postType]);

    return { success: true, data: rows };
  } catch (error) {
    console.error("Error getting comments: ", error);
    return { success: false, message: "Failed to retrieve comments" };
  }
};

// Helper function to hash a string to a number
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash); // Make it positive
}
