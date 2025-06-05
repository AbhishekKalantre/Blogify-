import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  fetchAllBlogPosts,
  fetchAllNewsArticles,
  fetchAllStories,
} from "../../utils/api";

const Hero = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const safeToISOString = (dateInput) => {
    try {
      if (!dateInput) return new Date().toISOString();
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return new Date().toISOString();
      return date.toISOString();
    } catch {
      console.warn("Invalid date:", dateInput);
      return new Date().toISOString();
    }
  };

  // Ensure image URL is absolute and valid
  const getValidImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x400?text=No+Image";

    // Check if URL is already absolute
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a relative URL, prepend with server base URL
    // Assuming the API is running on the same domain in production
    // Use window.location.hostname to determine if we're in development
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const baseUrl = isLocalhost
      ? "http://localhost:3000"
      : window.location.origin;

    // If the URL starts with a slash, use it directly, otherwise add a slash
    return url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  };

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);

        const [blogsResponse, newsResponse, storiesResponse] =
          await Promise.all([
            fetchAllBlogPosts(),
            fetchAllNewsArticles(),
            fetchAllStories(),
          ]);

        let allPosts = [];

        if (blogsResponse.success) {
          const formattedBlogs = blogsResponse.data.map((blog) => ({
            id: blog.id || blog._id,
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            author: blog.author || "Unknown Author",
            tags: blog.tags || [],
            category: "blog",
            subcategory: blog.tags?.[0] || "general",
            imageUrl: getValidImageUrl(blog.imageUrl),
            date: safeToISOString(blog.createdAt),
            createdAt: blog.createdAt,
          }));
          allPosts.push(...formattedBlogs);
        }

        console.log("Blogs:", blogsResponse.data);

        if (newsResponse.success) {
          const formattedNews = newsResponse.data.map((news) => ({
            id: news.id || news._id,
            title: news.title,
            excerpt: news.excerpt,
            content: news.content,
            author: news.author || "Unknown Author",
            tags: news.tags || [],
            category: "news",
            subcategory: news.tags?.[0] || "general",
            imageUrl: getValidImageUrl(news.imageUrl),
            date: safeToISOString(news.createdAt),
            createdAt: news.createdAt,
          }));
          allPosts.push(...formattedNews);
        }

        if (storiesResponse.success) {
          const formattedStories = storiesResponse.data.map((story) => ({
            id: story.id || story._id,
            title: story.title,
            excerpt: story.excerpt,
            content: story.content,
            author: story.author || "Unknown Author",
            tags: story.tags || [],
            category: "story",
            subcategory: story.tags?.[0] || "general",
            imageUrl: getValidImageUrl(story.imageUrl),
            date: safeToISOString(story.createdAt),
            createdAt: story.createdAt,
          }));
          allPosts.push(...formattedStories);
        }

        // Get the 3 most recent posts
        const sortedPosts = allPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        console.log("Featured posts with images:", sortedPosts);
        setFeaturedPosts(sortedPosts);
        setImageError(false); // Reset image error state
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch recent posts");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Get like data from localStorage on component mount
  useEffect(() => {
    const likeCounts = JSON.parse(localStorage.getItem("likeCounts")) || {};
    setLikeCount(likeCounts);
  }, []);

  // Generate avatar with initials
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "NA";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle next and previous post navigation
  const goToNextPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
    setImageError(false); // Reset image error when changing posts
  };

  const goToPreviousPost = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + featuredPosts.length) % featuredPosts.length
    );
    setImageError(false); // Reset image error when changing posts
  };

  // Format the date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageError = () => {
    console.warn("Image failed to load:", currentPost?.imageUrl);
    setImageError(true);
  };

  const currentPost = featuredPosts[currentIndex];

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Discover Insightful Articles
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Stay informed with the latest news, stories, and expert insights
            from our community of writers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/blogs"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Reading
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="ml-2 text-gray-600">Loading recent posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : featuredPosts.length > 0 && currentPost ? (
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-200 rounded-lg"></div>
              <div className="relative bg-white p-4 shadow-xl rounded-lg overflow-hidden">
                <div className="relative">
                  {imageError ? (
                    <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                      <div className="text-center p-4">
                        <p className="text-gray-500 mb-2">
                          Image not available
                        </p>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {currentPost.category.charAt(0).toUpperCase() +
                            currentPost.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={currentPost.imageUrl}
                      alt={currentPost.title}
                      className="w-full h-64 object-cover rounded-md"
                      onError={handleImageError}
                    />
                  )}

                  {likeCount[currentPost.id] > 0 && (
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Heart size={14} className="fill-red-500 text-red-500" />
                      <span className="text-xs font-medium">
                        {likeCount[currentPost.id]}
                      </span>
                    </div>
                  )}

                  {/* Navigation controls */}
                  {featuredPosts.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex space-x-2">
                      <button
                        onClick={goToPreviousPost}
                        className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        onClick={goToNextPost}
                        className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Pagination indicator */}
                  {featuredPosts.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex space-x-1">
                      {featuredPosts.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentIndex
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-2">
                    {currentPost.category.charAt(0).toUpperCase() +
                      currentPost.category.slice(1)}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {currentPost.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{currentPost.excerpt}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium mr-3">
                      {getInitials(currentPost.author)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {currentPost.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(currentPost.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <p className="text-gray-500">No posts available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
