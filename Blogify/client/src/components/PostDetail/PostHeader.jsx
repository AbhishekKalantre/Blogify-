// eslint-disable-next-line no-unused-vars
import React from "react";
import { motion } from "framer-motion";
import { Clock, Heart, Bookmark } from "lucide-react";

const PostHeader = ({
  title,
  category,
  categoryColors,
  date,
  author,
  getInitials,
  liked,
  saved,
  likeCount,
  handleLike,
  handleSave,
  variants,
}) => {
  // Estimate reading time based on content length - around 200 words per minute
  const readingTime = Math.max(3, Math.ceil(title.length / 5)); // Just a placeholder calculation

  return (
    <motion.div variants={variants} className="mb-8">
      {/* Category badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
            categoryColors[category] || "bg-gray-100 text-gray-800"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>

      {/* Author and Date */}
      <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium">
            {getInitials(author)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{author}</p>
            <p className="text-sm">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Clock size={18} />
          <span className="text-sm">{readingTime} min read</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            liked
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart
            size={18}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            saved
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Bookmark
            size={18}
            className={saved ? "fill-indigo-500 text-indigo-500" : ""}
          />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default PostHeader;
