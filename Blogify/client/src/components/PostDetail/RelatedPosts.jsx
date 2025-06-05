import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchRelatedPosts } from "../../utils/api";
import { Calendar, Tag, LinkIcon, Filter } from "lucide-react";

const RelatedPosts = ({ category, currentPostId, tags }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tagFilterActive, setTagFilterActive] = useState(true);

  // Convert tags to array if it's a string or undefined - do this up front
  const currentTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? [tags]
    : [];

  useEffect(() => {
    const getRelatedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          `Fetching related posts for category: ${category}, postId: ${currentPostId}, tags: ${
            tags ? JSON.stringify(tags) : "[]"
          }`
        );

        // Validate tags input
        const validTags = Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? [tags]
          : [];

        // Skip API call if post ID is undefined or if it contains only numbers > 100000000
        // (likely to be a generated ID that doesn't exist in the database)
        if (!currentPostId) {
          console.warn("Missing category or currentPostId for related posts");
          setLoading(false);
          return;
        }

        // Check if ID seems to be a generated fallback ID (very large number)
        if (/^\d{9,}$/.test(currentPostId?.toString())) {
          console.warn(
            "Detected generated fallback ID, skipping related posts request"
          );
          setLoading(false);
          setRelatedPosts([]);
          return;
        }

        // If no tags provided, log a warning but still fetch related posts based on category
        if (validTags.length === 0) {
          console.warn(
            "No tags provided for related posts, using category only"
          );
        }

        const response = await fetchRelatedPosts(
          category,
          currentPostId,
          8, // Increased to get more potential matches
          validTags
        );
        console.log("Related posts API response:", response);

        if (response.success) {
          const formattedPosts = response.data
            .map((post) => {
              // Check if post has the required fields
              if (!post.id || !post.title) {
                console.warn(
                  "Invalid post data in related posts response:",
                  post
                );
                return null;
              }

              // Calculate tag matching score
              const postTags = Array.isArray(post.tags) ? post.tags : [];
              const matchingTags = postTags.filter((tag) =>
                validTags.some((t) => t.toLowerCase() === tag.toLowerCase())
              );

              const tagMatchScore =
                matchingTags.length /
                (validTags.length > 0 ? validTags.length : 1);

              // Set a threshold for "significant" tag match
              const hasSignificantTagMatch = matchingTags.length > 0;

              return {
                id: post.id,
                title: post.title,
                excerpt:
                  post.excerpt ||
                  (post.content ? post.content.substring(0, 120) + "..." : ""),
                author: post.author || "Anonymous",
                category: post.category || category,
                imageUrl:
                  post.imageUrl ||
                  `https://placehold.co/600x400?text=${
                    (post.category || category).charAt(0).toUpperCase() +
                    (post.category || category).slice(1)
                  }`,
                date: (() => {
                  try {
                    // Check both field naming conventions
                    const date = new Date(post.created_at || post.createdAt);
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
                tags: postTags,
                matchingTags: matchingTags,
                tagMatchScore: tagMatchScore,
                hasSignificantTagMatch: hasSignificantTagMatch,
                relevanceScore: post.relevanceScore || tagMatchScore,
              };
            })
            .filter(Boolean); // Remove any null entries

          // Sort posts by tag match score (highest first)
          formattedPosts.sort((a, b) => b.tagMatchScore - a.tagMatchScore);

          console.log("Formatted related posts:", formattedPosts);
          setRelatedPosts(formattedPosts);
        } else {
          console.error("Error in related posts response:", response.message);
          setError(response.message || "Failed to load related posts");
        }
      } catch (err) {
        console.error("Error fetching related posts:", err);
        // Handle "Post not found" error more gracefully
        if (err.message && err.message.includes("Post not found")) {
          setRelatedPosts([]);
        } else {
          setError("Failed to load related posts. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    getRelatedPosts();
  }, [category, currentPostId, tags]);

  // Toggle tag filter
  const toggleTagFilter = () => {
    setTagFilterActive(!tagFilterActive);
  };

  // Filter posts based on tag match if filter is active
  const filteredPosts =
    tagFilterActive && currentTags.length > 0
      ? relatedPosts.filter((post) => post.hasSignificantTagMatch)
      : relatedPosts;

  // Map categories to corresponding colors
  const categoryColors = {
    blog: "bg-blue-100 text-blue-800",
    story: "bg-rose-100 text-rose-800",
    news: "bg-amber-100 text-amber-800",
  };

  if (loading) {
    return (
      <div className="mt-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // If tag filter is active but no posts match the tags
  if (
    tagFilterActive &&
    currentTags.length > 0 &&
    filteredPosts.length === 0 &&
    relatedPosts.length > 0
  ) {
    return (
      <div className="mt-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold">Posts Tagged With</h2>

            <div className="mt-2 md:mt-0">
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 text-amber-700 rounded-lg mb-4">
            <p>No posts found matching these exact tags.</p>
          </div>

          <button
            onClick={toggleTagFilter}
            className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Filter size={14} className="mr-2" />
            Show all related posts
          </button>
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return (
      <div className="mt-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Related Posts By Tags</h2>
          <p className="text-gray-500">
            No related posts found with similar content.
          </p>
          {currentTags.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">
                Current post uses these tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                There are no other posts with matching tags yet. Try adding more
                posts with similar tags.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              This post doesn't have any tags. Try adding tags to help readers
              discover related content.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {tagFilterActive && currentTags.length > 0
                ? "Posts Tagged With"
                : "Related Posts"}
            </h2>
            {tagFilterActive && currentTags.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Showing posts that match{" "}
                {filteredPosts.length > 0
                  ? `${filteredPosts.length} of ${relatedPosts.length}`
                  : "none of"}{" "}
                related posts
              </p>
            )}
          </div>

          {currentTags.length > 0 && (
            <div className="mt-3 md:mt-0 flex items-center gap-4">
              {relatedPosts.length > filteredPosts.length && (
                <button
                  onClick={toggleTagFilter}
                  className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs"
                >
                  <Filter size={14} className="mr-1" />
                  {tagFilterActive ? "Show all related" : "Filter by tags"}
                </button>
              )}

              <div className="flex flex-wrap gap-2">
                {currentTags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
                {currentTags.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{currentTags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tag match explanation */}
        {tagFilterActive &&
          currentTags.length > 0 &&
          filteredPosts.length > 0 && (
            <div className="mb-6 px-4 py-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700 flex items-start">
                <LinkIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Posts shown below have at least one matching tag with the
                  current post
                </span>
              </p>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link to={`/${post.category}/${post.id}`} key={post.id}>
              <div
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border ${
                  post.hasSignificantTagMatch
                    ? "border-indigo-200"
                    : "border-gray-100"
                } h-full flex flex-col`}
              >
                <div className="relative h-48">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x400?text=${post.category}`;
                    }}
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                      categoryColors[post.category] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {post.category.charAt(0).toUpperCase() +
                      post.category.slice(1)}
                  </div>

                  {post.matchingTags && post.matchingTags.length > 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center">
                      <Tag size={10} className="mr-1" />
                      {post.matchingTags.length}{" "}
                      {post.matchingTags.length === 1 ? "tag" : "tags"} match
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Display matched tags first, then other tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto mb-3">
                      {/* Show matching tags first */}
                      {post.matchingTags &&
                        post.matchingTags.slice(0, 3).map((tag, index) => (
                          <span
                            key={`matching-${index}`}
                            className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-2 py-1 rounded-full flex items-center"
                          >
                            <Tag size={10} className="mr-1" />
                            {tag}
                            <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                          </span>
                        ))}

                      {/* Then show non-matching tags */}
                      {post.tags
                        .filter(
                          (tag) =>
                            !post.matchingTags ||
                            !post.matchingTags.includes(tag)
                        )
                        .slice(
                          0,
                          3 - (post.matchingTags ? post.matchingTags.length : 0)
                        )
                        .map((tag, index) => (
                          <span
                            key={`non-matching-${index}`}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center"
                          >
                            <Tag size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}

                      {post.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    {post.category !== category && (
                      <div className="flex items-center text-indigo-500">
                        <LinkIcon size={12} className="mr-1" />
                        <span>Cross-category</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedPosts;
