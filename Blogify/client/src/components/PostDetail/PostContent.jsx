import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Tag, Heart, Bookmark } from "lucide-react";

const { div: MotionDiv, button: MotionButton, span: MotionSpan } = motion;

const PostContent = ({
  post,
  itemVariants,
  liked,
  likeCount,
  saved,
  handleLike,
  handleSave,
  getCategoryPath,
  content,
  variants,
}) => {
  return (
    <MotionDiv variants={itemVariants}>
      <motion.div
        variants={variants}
        className="prose prose-lg max-w-none text-gray-700 mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags and interaction buttons */}
      <div className="flex flex-wrap items-center justify-between mt-8">
        <MotionDiv variants={itemVariants} className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <MotionSpan
              key={index}
              className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
            >
              <Tag size={14} />
              {tag}
            </MotionSpan>
          ))}
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="flex items-center gap-2">
          <MotionButton
            onClick={handleLike}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
          >
            <Heart
              size={18}
              className={`${
                liked ? "fill-red-500 text-red-500" : "text-gray-500"
              } transition-colors`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </MotionButton>

          <MotionButton
            onClick={handleSave}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
          >
            <Bookmark
              size={18}
              className={`${
                saved ? "fill-yellow-500 text-yellow-500" : "text-gray-500"
              } transition-colors`}
            />
            <span className="text-sm font-medium">
              {saved ? "Saved" : "Save"}
            </span>
          </MotionButton>
        </MotionDiv>
      </div>

      {/* Back button */}
      <MotionDiv variants={itemVariants} className="mt-12">
        <Link
          to={getCategoryPath()}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Back to{" "}
          {post.category === "blog"
            ? "Blogs"
            : post.category === "story"
            ? "Stories"
            : "News"}
        </Link>
      </MotionDiv>
    </MotionDiv>
  );
};

export default PostContent;
