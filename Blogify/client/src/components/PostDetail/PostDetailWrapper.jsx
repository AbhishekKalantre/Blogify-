import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBlogPostById,
  fetchNewsArticleById,
  fetchStoryById,
  formatImageUrl,
} from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import API base URL
const API_BASE_URL = "http://localhost:3000";

const PostDetailWrapper = ({ children }) => {
  const { id, type } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);

        // Check if id is undefined or invalid
        if (!id || id === "undefined") {
          setError("Invalid post ID");
          toast.error("Invalid post ID. Post not found.");
          setLoading(false);
          return;
        }

        // Check if type is valid
        if (!type || !["blog", "news", "story"].includes(type)) {
          setError("Invalid post type");
          toast.error("Invalid post type. Post not found.");
          setLoading(false);
          return;
        }

        let response;

        // Determine which API endpoint to use based on post type
        switch (type) {
          case "blog":
            response = await fetchBlogPostById(id);
            break;
          case "news":
            response = await fetchNewsArticleById(id);
            break;
          case "story":
            response = await fetchStoryById(id);
            break;
          default:
            throw new Error("Invalid post type");
        }

        if (response.success) {
          // Format the post data consistently
          const postData = response.data;

          // Use the helper function to format image URL
          const imageUrl =
            formatImageUrl(postData.imageUrl) ||
            `https://placehold.co/600x400?text=${
              type.charAt(0).toUpperCase() + type.slice(1)
            }`;

          setPost({
            id: postData._id,
            title: postData.title,
            content: postData.content,
            author: postData.author,
            excerpt: postData.excerpt,
            imageUrl: imageUrl,
            date: postData.createdAt,
            tags: postData.tags || [],
            category: type,
            subcategory: postData.tags?.[0] || "general",
          });
        } else {
          setError(response.message || "Failed to fetch post details");
          toast.error(response.message || "Failed to fetch post details");
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to fetch post details");
        toast.error("Failed to fetch post details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchPostDetails();
    } else {
      setLoading(false);
      setError("Missing post information");
      toast.error(
        "Missing post information. Please try again with a valid post."
      );
    }
  }, [id, type]);

  // Return to appropriate list page based on post type
  const handleBackClick = () => {
    switch (type) {
      case "blog":
        navigate("/blogs");
        break;
      case "news":
        navigate("/news");
        break;
      case "story":
        navigate("/stories");
        break;
      default:
        navigate("/");
    }
  };

  // Pass the modified props to children
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        post,
        loading,
        error,
        onBackClick: handleBackClick,
      });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default PostDetailWrapper;
