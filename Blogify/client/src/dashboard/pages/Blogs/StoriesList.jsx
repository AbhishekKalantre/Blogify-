import React, { useState, useEffect } from "react";
import PostList from "../../components/PostList";
import axios from "axios";

const StoriesList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts/stories");

        // Detailed logging for debugging
        console.log("API Response:", response);
        console.log("Response data:", response.data);

        // For now, let's handle different possible response formats to fix the error
        if (response.data && Array.isArray(response.data)) {
          // Case 1: API returns array directly
          setStories(response.data);
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          // Case 2: API returns {success: true, data: [...]}
          setStories(response.data.data);
        } else if (response.data && Array.isArray(response.data.stories)) {
          // Case 3: API returns {stories: [...]}
          setStories(response.data.stories);
        } else {
          // If no recognized format, initialize as empty array to avoid crash
          console.error("Unrecognized data format:", response.data);
          setStories([]);
          setError("Unrecognized data format received from server");
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/posts/story/${id}`);
      setStories(stories.filter((story) => story.id !== id));
    } catch (err) {
      console.error("Error deleting story:", err);
      // You could add toast notification here for error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 md:p-8 rounded-xl shadow-md text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Stories</h1>
        <p className="opacity-90">Manage your personal and narrative content</p>
      </div>

      <PostList
        title="All Stories"
        posts={stories}
        category="Story"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default StoriesList;
