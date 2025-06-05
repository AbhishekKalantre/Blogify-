import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  Tag as TagIcon,
  Edit,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPost = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First try to get post from location state (passed from the list)
    if (location.state && location.state.post) {
      setPost(location.state.post);
      setLoading(false);
      return;
    }

    // If not available in state, fetch from API
    const fetchPost = async () => {
      try {
        setLoading(true);

        // We don't know which category this post belongs to, so try all endpoints
        const endpoints = [
          `/api/posts/blog/${id}`,
          `/api/posts/news/${id}`,
          `/api/posts/story/${id}`,
        ];

        // Try each endpoint until we find the post
        let foundPost = null;
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(endpoint);

            console.log(`Response from ${endpoint}:`, response);

            if (response.data && response.data.success) {
              // Add category to the post based on the endpoint
              const postData = response.data.data;
              if (endpoint.includes("/blog/")) {
                postData.category = "blog";
              } else if (endpoint.includes("/news/")) {
                postData.category = "news";
              } else if (endpoint.includes("/story/")) {
                postData.category = "story";
              }

              foundPost = postData;
              break;
            }
          } catch (err) {
            // Continue trying other endpoints
            console.log(`Error fetching from ${endpoint}:`, err);
          }
        }

        if (foundPost) {
          setPost(foundPost);
          setError(null);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, location]);

  const getCategoryColor = (category) => {
    const colors = {
      blog: "bg-blue-100 text-blue-700",
      news: "bg-green-100 text-green-700",
      story: "bg-purple-100 text-purple-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = () => {
    navigate(`/dashboard/edit-post/${id}`, { state: { post } });
  };

  const handleBackToList = () => {
    if (post) {
      if (post.category === "blog") {
        navigate("/dashboard/blogs");
      } else if (post.category === "news") {
        navigate("/dashboard/news");
      } else {
        navigate("/dashboard/stories");
      }
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Post not found
        </h2>
        <p className="text-gray-600 mb-4">
          {error ||
            "The post you're looking for doesn't exist or has been removed."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 md:h-80 object-cover rounded-xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/1200x600/EEE/999?text=Image+Not+Found";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent rounded-xl"></div>

        {/* Post Meta Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex justify-between items-center mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                post.category
              )}`}
            >
              {post.category
                ? post.category.charAt(0).toUpperCase() + post.category.slice(1)
                : "Post"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs"
              >
                <Edit size={14} /> Edit
              </button>
              <a
                href="#"
                className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `/post/${post.id}`;
                  toast.info(`In a real app, this would link to ${url}`);
                }}
              >
                <ExternalLink size={14} /> View Live
              </a>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(post.createdAt || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>5 min read</span>
            </div>
            <div>
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="prose max-w-none">
          <p className="text-xl text-gray-700 mb-6">{post.excerpt}</p>
          <div className="text-gray-600">{post.content}</div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  <TagIcon size={14} className="text-gray-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to{" "}
            {post.category === "blog"
              ? "Blogs"
              : post.category === "news"
              ? "News"
              : "Stories"}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ViewPost;
