import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../PostCard";
import { fetchAllBlogPosts } from "../../utils/api";

const FeaturedPosts = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllBlogPosts();
        console.log("API Response:", response); // Debug log

        if (response.success) {
          const formattedPosts = response.data
            .map((blog) => ({
              id: blog.id || blog._id, // Use the numeric ID from the database
              title: blog.title,
              excerpt: blog.excerpt,
              content: blog.content,
              author: blog.author,
              tags: blog.tags,
              category: "blog",
              subcategory: blog.tags?.[0] || "general",
              imageUrl:
                blog.imageUrl || "https://placehold.co/600x400?text=Blog",
              date: safeToISOString(blog.createdAt),
            }))
            .slice(0, 3); // Only the first 3 posts

          setFeaturedPosts(formattedPosts);
        } else {
          throw new Error(response.message || "Failed to fetch featured posts");
        }
      } catch (err) {
        console.error("Error fetching featured posts:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading featured posts...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Featured Posts</h2>
          <Link
            to="/blogs"
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              key="view-all-arrow"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured posts available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPosts;
