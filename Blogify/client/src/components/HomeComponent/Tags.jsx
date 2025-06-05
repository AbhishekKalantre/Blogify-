import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Tag, X, ChevronDown, ChevronUp } from "lucide-react";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTags, setExpandedTags] = useState({});

  const tagColors = [
    {
      color: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      color: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      color: "bg-purple-100",
      textColor: "text-purple-700",
    },
    {
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
    {
      color: "bg-red-100",
      textColor: "text-red-700",
    },
    {
      color: "bg-indigo-100",
      textColor: "text-indigo-700",
    },
    {
      color: "bg-pink-100",
      textColor: "text-pink-700",
    },
    {
      color: "bg-teal-100",
      textColor: "text-teal-700",
    },
  ];

  useEffect(() => {
    const fetchTagsAndPosts = async () => {
      try {
        // Get the tags
        const tagsResponse = await axios.get("http://localhost:3000/api/tags");

        // Get tag usage counts
        const usageResponse = await axios.get(
          "http://localhost:3000/api/tags/usage"
        );

        // Get all posts (blogs, stories, news)
        const [blogsResponse, storiesResponse, newsResponse] =
          await Promise.all([
            axios.get("http://localhost:3000/api/posts/blogs"),
            axios.get("http://localhost:3000/api/posts/stories"),
            axios.get("http://localhost:3000/api/posts/news"),
          ]);

        // Combine all posts
        const allPosts = {};

        if (blogsResponse.data.success) {
          blogsResponse.data.data.forEach((post) => {
            if (Array.isArray(post.tags)) {
              post.tags.forEach((tag) => {
                if (!allPosts[tag]) allPosts[tag] = [];
                allPosts[tag].push({ ...post, type: "blog" });
              });
            }
          });
        }

        if (storiesResponse.data.success) {
          storiesResponse.data.data.forEach((post) => {
            if (Array.isArray(post.tags)) {
              post.tags.forEach((tag) => {
                if (!allPosts[tag]) allPosts[tag] = [];
                allPosts[tag].push({ ...post, type: "story" });
              });
            }
          });
        }

        if (newsResponse.data.success) {
          newsResponse.data.data.forEach((post) => {
            if (Array.isArray(post.tags)) {
              post.tags.forEach((tag) => {
                if (!allPosts[tag]) allPosts[tag] = [];
                allPosts[tag].push({ ...post, type: "news" });
              });
            }
          });
        }

        setPosts(allPosts);

        if (tagsResponse.data.success && usageResponse.data.success) {
          // Combine the tag data with usage counts
          const tagsWithCounts = tagsResponse.data.data.map((tag) => {
            const usageInfo = usageResponse.data.data.find(
              (item) => item.tag === tag.name
            );
            const count = usageInfo ? usageInfo.count : 0;

            // Assign a random color if the tag doesn't have one
            const tagColorIndex = tag.id % tagColors.length;
            const tagStyle = tagColors[tagColorIndex];

            return {
              ...tag,
              count,
              color: tag.color || tagStyle.color,
              textColor: tagStyle.textColor,
            };
          });

          // Sort by usage count descending
          tagsWithCounts.sort((a, b) => b.count - a.count);
          setTags(tagsWithCounts);
        } else {
          setError("Failed to fetch tags");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading tags. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTagsAndPosts();
  }, []);

  const toggleTagExpansion = (tagName) => {
    setExpandedTags((prev) => ({
      ...prev,
      [tagName]: !prev[tagName],
    }));
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p>Loading tags...</p>
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Explore Tags
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover content that matters to you. Browse articles across various
            topics and find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div key={tag.id} className="flex flex-col">
                <div
                  className={`${tag.color} ${tag.textColor} rounded-lg p-6 flex flex-col transition-transform hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">
                        <Tag size={36} />
                      </span>
                      <div>
                        <h3 className="font-bold text-lg">{tag.name}</h3>
                        <p>
                          {tag.count} {tag.count === 1 ? "article" : "articles"}
                        </p>
                        {tag.description && (
                          <p className="text-sm mt-1 opacity-80">
                            {tag.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTagExpansion(tag.name)}
                      className="p-2 rounded-full hover:bg-white/20"
                    >
                      {expandedTags[tag.name] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Link
                      to={`/blogs?tag=${encodeURIComponent(tag.name)}`}
                      className={`px-3 py-1 rounded ${tag.textColor} bg-white/50 text-sm hover:bg-white/80 transition-colors`}
                    >
                      View Blogs
                    </Link>
                    <Link
                      to={`/stories?tag=${encodeURIComponent(tag.name)}`}
                      className={`px-3 py-1 rounded ${tag.textColor} bg-white/50 text-sm hover:bg-white/80 transition-colors`}
                    >
                      View Stories
                    </Link>
                    <Link
                      to={`/news?tag=${encodeURIComponent(tag.name)}`}
                      className={`px-3 py-1 rounded ${tag.textColor} bg-white/50 text-sm hover:bg-white/80 transition-colors`}
                    >
                      View News
                    </Link>
                  </div>
                </div>

                {/* Expanded section showing posts with this tag */}
                {expandedTags[tag.name] && posts[tag.name] && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2 shadow-sm">
                    <h4 className="font-medium mb-2">
                      Articles with this tag:
                    </h4>
                    <ul className="max-h-60 overflow-y-auto">
                      {posts[tag.name]?.map((post, index) => (
                        <li
                          key={index}
                          className="mb-2 pb-2 border-b border-gray-100 last:border-0"
                        >
                          <Link
                            to={`/${post.type}/${post._id}`}
                            className="text-sm hover:text-blue-600 flex items-start"
                          >
                            <span className="rounded-full px-2 py-0.5 text-xs bg-gray-200 text-gray-700 mr-2 uppercase">
                              {post.type}
                            </span>
                            <span className="flex-1">{post.title}</span>
                          </Link>
                        </li>
                      ))}
                      {!posts[tag.name]?.length && (
                        <li className="text-sm text-gray-500">
                          No articles found with this tag.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p>No tags found. Start adding tags to your content!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tags;
