// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  SocialShare,
  AuthorInfo,
  RelatedPosts,
  Comments,
  PostHeader,
  PostContent,
} from "../components/PostDetail";

const PostDetail = ({ post, loading, error, onBackClick }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef(null);

  // Set up initial states when post data is loaded
  useEffect(() => {
    if (post) {
      console.log("Full post object in PostDetail:", post);

      // Ensure the post has an ID
      if (post.id === undefined || post.id === null) {
        // Generate an ID based on the title and other properties
        const generatedId = getPostId(post);
        console.log("Post had no ID, generated:", generatedId);

        // Modify the post object directly to add the ID
        post.id = generatedId;
      }

      // Extract the post ID safely
      const postId = getPostId(post);
      console.log("Extracted post ID:", postId);

      // Get likes from localStorage
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
      setLiked(!!likedPosts[postId]);

      const likeCounts = JSON.parse(localStorage.getItem("likeCounts")) || {};
      setLikeCount(likeCounts[postId] || 0);

      // Get saved state from localStorage
      const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || {};
      setSaved(!!savedPosts[postId]);
    }
  }, [post]);

  console.log(post);

  // Helper function to get the post ID regardless of the data structure
  const getPostId = (post) => {
    if (!post) return null;

    // Try different possible ID field names
    const possibleIdFields = ["id", "Id", "_id", "ID", "postId"];

    for (const field of possibleIdFields) {
      if (post[field] !== undefined && post[field] !== null) {
        return post[field];
      }
    }

    // If we couldn't find an ID, generate a temporary one based on the title or other properties
    // This ensures we can still add comments even without an explicit ID
    if (post.title) {
      // Create a deterministic ID by hashing the title and other properties
      const hashSource = `${post.title}-${post.author || ""}-${
        post.category || ""
      }`;
      let generatedId = 0;
      for (let i = 0; i < hashSource.length; i++) {
        generatedId =
          (generatedId << 5) - generatedId + hashSource.charCodeAt(i);
        generatedId = generatedId & generatedId; // Convert to 32bit integer
      }
      generatedId = Math.abs(generatedId); // Make sure it's positive
      console.log(
        "Generated fallback ID:",
        generatedId,
        "for post:",
        post.title
      );
      return generatedId;
    }

    // Last resort - completely random ID
    const fallbackId = Math.floor(Math.random() * 1000000) + 1;
    console.log("Using random fallback ID:", fallbackId);
    return fallbackId;
  };

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const element = articleRef.current;
      const totalHeight = element.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const currentPosition = scrollTop + windowHeight;
      const articleOffset = element.offsetTop;

      // Calculate reading progress
      const currentProgress = Math.min(
        100,
        Math.max(
          0,
          ((currentPosition - articleOffset) / (totalHeight + articleOffset)) *
            100
        )
      );

      setReadingProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle like/unlike
  const handleLike = () => {
    if (!post) return;

    // Toggle liked state
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Update like count
    const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount >= 0 ? newCount : 0);

    // Save to localStorage
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    likedPosts[getPostId(post)] = newLikedState;
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    const likeCounts = JSON.parse(localStorage.getItem("likeCounts")) || {};
    likeCounts[getPostId(post)] = newCount >= 0 ? newCount : 0;
    localStorage.setItem("likeCounts", JSON.stringify(likeCounts));
  };

  // Handle save/unsave blog post
  const handleSave = () => {
    if (!post) return;

    // Toggle saved state
    const newSavedState = !saved;
    setSaved(newSavedState);

    // Save to localStorage
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || {};
    savedPosts[getPostId(post)] = newSavedState;
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  };

  // Format the date to be more readable
  const formattedDate = (() => {
    try {
      if (!post.date) return "Date unavailable";

      const parsedDate = new Date(post.date);
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

  // Generate avatar with initials
  const getInitials = (name) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing (cubic bezier)
      },
    },
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-8 text-xl text-indigo-800 font-medium">
          Loading your content...
        </p>
      </div>
    );
  }

  // Show error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-lg bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || "Post not found"}
          </h1>
          <p className="text-gray-600 mb-10 text-lg">
            We couldn't find the post you're looking for. It might have been
            removed or you may have followed a broken link.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  console.log("Post Data: ", post);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-24 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 z-50 transition-all duration-300 shadow-sm"
        style={{ width: `${readingProgress}%` }}
      ></div>

      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <motion.div className="mb-10" variants={itemVariants}>
          <button
            onClick={onBackClick}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors group bg-white py-2 px-4 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft
              size={20}
              className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="font-medium">
              Back to{" "}
              {post.category === "blog"
                ? "Blogs"
                : post.category === "story"
                ? "Stories"
                : "News"}
            </span>
          </button>
        </motion.div>

        {/* Article Meta Info - Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-6 mb-8 text-gray-500 flex-wrap"
        >
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{Math.ceil(post.content.length / 1000)} min read</span>
          </div>
        </motion.div>

        {/* Main Article */}
        <article
          ref={articleRef}
          className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100"
        >
          {/* Post Header */}
          <PostHeader
            title={post.title}
            category={post.category}
            categoryColors={categoryColors}
            date={formattedDate}
            author={post.author}
            getInitials={getInitials}
            liked={liked}
            saved={saved}
            likeCount={likeCount}
            handleLike={handleLike}
            handleSave={handleSave}
            variants={itemVariants}
          />

          {/* Featured Image */}
          <motion.div
            variants={itemVariants}
            className="my-10 rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={
                post.imageUrl ||
                "https://placehold.co/1200x600?text=Featured+Image"
              }
              alt={post.title}
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/1200x600?text=Image+Error";
              }}
            />
          </motion.div>

          {/* Post Excerpt/Summary */}
          {post.excerpt && (
            <motion.div variants={itemVariants} className="mb-10">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
                  <span className="mr-2 text-xl">💡</span> Summary
                </h3>
                <p className="text-gray-700 leading-relaxed italic">
                  {post.excerpt}
                </p>
              </div>
            </motion.div>
          )}

          {/* Post Content */}
          <PostContent
            post={post}
            content={post.content}
            variants={itemVariants}
            liked={liked}
            likeCount={likeCount}
            saved={saved}
            handleLike={handleLike}
            handleSave={handleSave}
            getCategoryPath={() => `/${post.category}`}
            itemVariants={itemVariants}
          />

          {/* Tags */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-2"
          >
            {post.tags &&
              post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 px-5 py-2 rounded-full text-sm font-medium hover:shadow-md transition-all duration-300 border border-indigo-100"
                >
                  #{tag}
                </span>
              ))}
          </motion.div>

          {/* Social Share */}
          <SocialShare
            url={window.location.href}
            title={post.title}
            variants={itemVariants}
          />
        </article>

        {/* Author Info - Enhanced */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <AuthorInfo
              author={post.author}
              getInitials={getInitials}
              variants={itemVariants}
            />
          </div>
        </motion.div>

        {/* Related Posts - Enhanced */}
        {/* <motion.div variants={itemVariants} className="mt-12">
          <RelatedPosts
            category={post.category}
            currentPostId={post.id}
            tags={post.tags}
          />
        </motion.div> */}

        {/* Comments Section - Enhanced */}
        <div className="mt-20 max-w-4xl mx-auto px-4">
          <Comments
            postId={getPostId(post)}
            postType={post?.category || post?.post_type || "blog"}
            initialComments={comments}
            setComments={setComments}
            variants={itemVariants}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail;
