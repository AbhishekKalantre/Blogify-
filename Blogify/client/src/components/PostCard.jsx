import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag, Heart } from "lucide-react";
import { formatImageUrl } from "../utils/api";

// Import API base URL
const API_BASE_URL = "http://localhost:3000";

const PostCard = ({ post }) => {
  const { id, title, excerpt, imageUrl, author, date, tags, category } = post;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [formattedImageUrl, setFormattedImageUrl] = useState(null);

  // Get likes from localStorage on component mount and format image URL
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    if (likedPosts[id]) {
      setLiked(true);
    }

    const likeCounts = JSON.parse(localStorage.getItem("likeCounts")) || {};
    setLikeCount(likeCounts[id] || 0);

    // Format image URL properly using the helper function
    if (imageUrl) {
      setFormattedImageUrl(formatImageUrl(imageUrl));
    } else {
      setFormattedImageUrl(null);
    }
  }, [id, imageUrl]);

  // Format the date to be more readable
  const formattedDate = (() => {
    try {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Date unavailable";
    } catch {
      return "Date unavailable";
    }
  })();

  // Map categories to corresponding colors
  const categoryColors = {
    blog: "bg-blue-100 text-blue-800",
    story: "bg-rose-100 text-rose-800",
    news: "bg-amber-100 text-amber-800",
  };

  // Generate avatar with initials if no image provided
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle like/unlike
  const handleLike = (e) => {
    e.preventDefault(); // Prevent navigation to post detail

    // Toggle liked state
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Update like count
    const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount >= 0 ? newCount : 0);

    // Save to localStorage
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    likedPosts[id] = newLikedState;
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    const likeCounts = JSON.parse(localStorage.getItem("likeCounts")) || {};
    likeCounts[id] = newCount >= 0 ? newCount : 0;
    localStorage.setItem("likeCounts", JSON.stringify(likeCounts));
  };

  // Get individual post detail URL using new route pattern
  const getPostDetailUrl = () => {
    // Use the new URL pattern with post type
    return `/${category}/${id}`;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
      <div className="relative">
        {formattedImageUrl ? (
          <img
            src={formattedImageUrl}
            alt={title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=Image+Error";
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[category] || "bg-gray-100 text-gray-800"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium">
                {getInitials(author)}
              </div>
            </div>
            <span>{author}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))
          ) : (
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Tag size={12} />
              general
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Link
            to={getPostDetailUrl()}
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Read More
          </Link>

          <button
            onClick={handleLike}
            className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors"
          >
            <Heart
              size={18}
              className={`${
                liked ? "fill-red-500 text-red-500" : "text-gray-400"
              } transition-colors`}
            />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
