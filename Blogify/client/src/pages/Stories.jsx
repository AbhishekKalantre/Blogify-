import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import PostCard from "../components/PostCard";
import SubcategoryFilter from "../components/SubcategoryFilter";
import { fetchAllStories, formatImageUrl } from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const { div: MotionDiv, h1: MotionH1, p: MotionP } = motion;

// Import API base URL
const API_BASE_URL = "http://localhost:3000";

const Stories = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory] = useState("story"); // Always "story" for this page
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stories from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllStories();
        if (response.success) {
          setPosts(
            response.data.map((story) => {
              return {
                id: story._id,
                title: story.title,
                excerpt: story.excerpt,
                content: story.content,
                author: story.author,
                tags: story.tags,
                category: "story",
                subcategory: story.tags?.[0] || "general",
                imageUrl: formatImageUrl(story.imageUrl),
                date: (() => {
                  try {
                    const date = new Date(story.created_at);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    } else {
                      return "Date unavailable";
                    }
                  } catch {
                    return "Date unavailable";
                  }
                })(),
              };
            })
          );
        } else {
          setError(response.message || "Failed to fetch stories");
          toast.error(response.message || "Failed to fetch stories");
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to fetch stories");
        toast.error("Failed to fetch stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Extract tag from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setActiveSubcategory(tagParam.toLowerCase());
    } else {
      setActiveSubcategory("all");
    }
  }, [location.search]);

  // Filter posts whenever posts array or active subcategory changes
  useEffect(() => {
    if (posts.length > 0) {
      filterPosts();
    }
  }, [posts, activeSubcategory]);

  const filterPosts = () => {
    // Filter by category (always "story" for this page)
    let filtered = posts;

    // Then filter by subcategory if not "all"
    if (activeSubcategory !== "all") {
      filtered = filtered.filter((post) => {
        // Check if post has tags array and if any tag matches the activeSubcategory
        if (Array.isArray(post.tags)) {
          return post.tags.some(
            (tag) => tag.toLowerCase() === activeSubcategory.toLowerCase()
          );
        }
        // Fallback to subcategory if tags aren't available
        return (
          post.subcategory.toLowerCase() === activeSubcategory.toLowerCase()
        );
      });
    }

    setFilteredPosts(filtered);
  };

  const handleSubcategoryChange = (subcategory) => {
    setActiveSubcategory(subcategory);

    // Update URL query parameter without reloading the page
    const searchParams = new URLSearchParams(location.search);
    if (subcategory === "all") {
      searchParams.delete("tag");
    } else {
      searchParams.set("tag", subcategory);
    }

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Get subcategory title for display
  const getSubcategoryTitle = () => {
    if (activeSubcategory === "all") return "All Stories";
    return `${
      activeSubcategory.charAt(0).toUpperCase() + activeSubcategory.slice(1)
    } Stories`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-8">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-2 bg-rose-100 rounded-full mb-4"
          >
            <BookOpen className="text-rose-600" size={24} />
          </MotionDiv>
          <MotionH1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            <span className="text-rose-600">{getSubcategoryTitle()}</span>
          </MotionH1>
          <MotionP
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-xl mt-5 mx-auto text-xl text-gray-500"
          >
            Explore captivating stories from our community of talented
            storytellers.
          </MotionP>
        </div>

        {/* Subcategory filter */}
        <SubcategoryFilter
          category={activeCategory}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={handleSubcategoryChange}
        />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
            <p className="mt-2 text-gray-600">Loading stories...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && (
          <>
            {filteredPosts.length > 0 ? (
              <MotionDiv
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPosts.map((post) => (
                  <MotionDiv key={post.id} variants={itemVariants}>
                    <PostCard post={post} />
                  </MotionDiv>
                ))}
              </MotionDiv>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No stories found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Stories;
