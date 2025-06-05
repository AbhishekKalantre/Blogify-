import React, { useState, useEffect } from "react";
import PostList from "../../components/PostList";
import axios from "axios";

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts/blogs");

        // Detailed logging for debugging
        console.log("API Response:", response);
        console.log("Response data:", response.data);

        // For now, let's handle different possible response formats to fix the error
        if (response.data && Array.isArray(response.data)) {
          // Case 1: API returns array directly
          setBlogs(response.data);
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          // Case 2: API returns {success: true, data: [...]}
          setBlogs(response.data.data);
        } else if (response.data && Array.isArray(response.data.blogs)) {
          // Case 3: API returns {blogs: [...]}
          setBlogs(response.data.blogs);
        } else {
          // If no recognized format, initialize as empty array to avoid crash
          console.error("Unrecognized data format:", response.data);
          setBlogs([]);
          setError("Unrecognized data format received from server");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/posts/blog/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
      // You could add toast notification here for error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 md:p-8 rounded-xl shadow-md text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Blog Posts</h1>
        <p className="opacity-90">Manage your blog content</p>
      </div>

      <PostList
        title="All Blog Posts"
        posts={blogs}
        category="Blog"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BlogsList;
