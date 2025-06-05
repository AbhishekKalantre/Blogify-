import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import axios from "axios";

const Comments = ({
  postId,
  postType = "blog",
  initialComments,
  setComments,
  variants,
}) => {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debug postId
  useEffect(() => {
    console.log("Current postId in Comments component:", postId);
    console.log("Current postType in Comments component:", postType);
  }, [postId, postType]);

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!postId) {
          console.error("Cannot fetch comments: postId is undefined");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/comments/${postId}/${postType}`
        );
        if (response.data.success) {
          setComments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    // Only fetch if we have a valid postId
    if (postId) {
      fetchComments();
    }
  }, [postId, postType, setComments]);

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!comment.trim() || !name.trim() || !email.trim()) {
      setError("All fields are required");
      return;
    }

    if (!postId) {
      setError("Cannot add comment: Post ID is missing");
      console.error("Cannot add comment: postId is undefined");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting comment with data:", {
        postId,
        postType,
        name,
        email,
        content: comment,
      });

      // Send comment to backend API
      const response = await axios.post("http://localhost:3000/api/comments", {
        postId: Number(postId), // Ensure postId is a number
        postType,
        name,
        email,
        content: comment,
      });

      if (response.data.success) {
        // Create new comment for UI update (with local ID for now)
        const newComment = {
          id: Date.now(),
          name,
          email,
          content: comment,
          date: new Date().toISOString(),
        };

        const updatedComments = [...initialComments, newComment];

        // Update state
        setComments(updatedComments);

        // Clear form
        setComment("");
        setName("");
        setEmail("");
      } else {
        setError(response.data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError(
        "An error occurred while submitting your comment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Motion.div variants={variants} className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={24} className="text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Comments ({initialComments.length})
        </h2>
      </div>

      {/* Comment list */}
      <div className="space-y-6 mb-10">
        {initialComments.length > 0 ? (
          initialComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium">
                  {getInitials(comment.name)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {comment.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.created_at || comment.date)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>

      {/* Comment form */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Leave a comment
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white rounded-lg transition-colors`}
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </Motion.div>
  );
};

export default Comments;
