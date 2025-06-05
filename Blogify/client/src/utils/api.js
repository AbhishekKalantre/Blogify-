export const API_BASE_URL = "http://localhost:3000";
export const API_URL = `${API_BASE_URL}/api`;

/**
 * Helper function to format image URLs
 */
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "https://placehold.co/600x400?text=No+Image";
  }

  // If it's already a server URL, return as is
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Format server-side image paths
  if (imageUrl.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  // Return as is for other cases
  return imageUrl;
};

/**
 * Generic fetch function with error handling
 */
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
}

/**
 * Blog post API functions
 */
export const fetchAllBlogPosts = async () => {
  return fetchData("/posts/blogs");
};

export const fetchBlogPostById = async (id) => {
  return fetchData(`/posts/blog/${id}`);
};

/**
 * News article API functions
 */
export const fetchAllNewsArticles = async () => {
  return fetchData("/posts/news");
};

export const fetchNewsArticleById = async (id) => {
  return fetchData(`/posts/news/${id}`);
};

/**
 * Stories API functions
 */
export const fetchAllStories = async () => {
  return fetchData("/posts/stories");
};

export const fetchStoryById = async (id) => {
  return fetchData(`/posts/story/${id}`);
};

/**
 * Related posts API function
 */
export const fetchRelatedPosts = async (
  category,
  postId,
  limit = 3,
  tags = []
) => {
  // Add the tags to the query if provided
  const tagsParam =
    tags && tags.length > 0
      ? `&tags=${encodeURIComponent(JSON.stringify(tags))}`
      : "";
  return fetchData(
    `/posts/${category}/related/${postId}?limit=${limit}${tagsParam}`
  );
};

export default {
  fetchAllBlogPosts,
  fetchBlogPostById,
  fetchAllNewsArticles,
  fetchNewsArticleById,
  fetchAllStories,
  fetchStoryById,
  fetchRelatedPosts,
  formatImageUrl,
};
