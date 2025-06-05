import React, { useState, useEffect } from "react";
import PostList from "../../components/PostList";
import axios from "axios";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts/news");

        // Detailed logging for debugging
        console.log("API Response:", response);
        console.log("Response data:", response.data);

        // For now, let's handle different possible response formats to fix the error
        if (response.data && Array.isArray(response.data)) {
          // Case 1: API returns array directly
          setNews(response.data);
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          // Case 2: API returns {success: true, data: [...]}
          setNews(response.data.data);
        } else if (response.data && Array.isArray(response.data.news)) {
          // Case 3: API returns {news: [...]}
          setNews(response.data.news);
        } else {
          // If no recognized format, initialize as empty array to avoid crash
          console.error("Unrecognized data format:", response.data);
          setNews([]);
          setError("Unrecognized data format received from server");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/posts/news/${id}`);
      setNews(news.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting news article:", err);
      // You could add toast notification here for error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 md:p-8 rounded-xl shadow-md text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">News Articles</h1>
        <p className="opacity-90">Manage your news and announcements</p>
      </div>

      <PostList
        title="All News Articles"
        posts={news}
        category="News"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NewsList;
