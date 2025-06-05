import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../PostCard";
import {
  fetchAllBlogPosts,
  fetchAllNewsArticles,
  fetchAllStories,
} from "../../utils/api";

const LatestPosts = () => {
  const [latestPosts, setLatestPosts] = useState([]);
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
    const fetchLatestPosts = async () => {
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
            author: blog.author,
            tags: blog.tags,
            category: "blog",
            subcategory: blog.tags?.[0] || "general",
            imageUrl: blog.imageUrl || "https://placehold.co/600x400?text=Blog",
            date: safeToISOString(blog.createdAt),
            createdAt: blog.createdAt,
          }));
          allPosts.push(...formattedBlogs);
        }

        if (newsResponse.success) {
          const formattedNews = newsResponse.data.map((news) => ({
            id: news.id || news._id,
            title: news.title,
            excerpt: news.excerpt,
            content: news.content,
            author: news.author,
            tags: news.tags,
            category: "news",
            subcategory: news.tags?.[0] || "general",
            imageUrl: news.imageUrl || "https://placehold.co/600x400?text=News",
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
            author: story.author,
            tags: story.tags,
            category: "story",
            subcategory: story.tags?.[0] || "general",
            imageUrl:
              story.imageUrl || "https://placehold.co/600x400?text=Story",
            date: safeToISOString(story.createdAt),
            createdAt: story.createdAt,
          }));
          allPosts.push(...formattedStories);
        }

        const sortedPosts = allPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map((post) => ({
            ...post,
            date: new Date(post.date).toLocaleDateString(),
          }));

        setLatestPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching latest posts:", err);
        setError("Failed to fetch latest posts");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Latest Posts</h2>
          <div className="flex space-x-4">
            {[
              {
                path: "/blogs",
                color: "text-indigo-600 hover:text-indigo-800",
                label: "Blogs",
              },
              {
                path: "/news",
                color: "text-amber-600 hover:text-amber-800",
                label: "News",
              },
              {
                path: "/stories",
                color: "text-rose-600 hover:text-rose-800",
                label: "Stories",
              },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`${item.color} font-medium flex items-center`}
              >
                {item.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="ml-2 text-gray-600">Loading latest posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {latestPosts.map((post) => (
              <PostCard key={`${post.id}-${post.category}`} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No latest posts available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPosts;
