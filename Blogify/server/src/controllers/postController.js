import BlogModel from "../models/blogModel.js";
import NewsModel from "../models/newsModel.js";
import StoryModel from "../models/storyModel.js";
import {
  createBlogPostQuery,
  getAllBlogPostsQuery,
  getBlogPostQuery,
  updateBlogPostQuery,
  deleteBlogPostQuery,
  createNewsArticleQuery,
  getAllNewsArticlesQuery,
  createStoryQuery,
  getAllStoriesQuery,
  getNewsArticleQuery,
  getStoryQuery,
  updateNewsArticleQuery,
  deleteNewsArticleQuery,
  updateStoryQuery,
  deleteStoryQuery,
} from "../services/postService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

// Helper function to save base64 image to file
const saveImageToFile = (base64Image) => {
  // If it's not a base64 image, return the original URL
  if (!base64Image || !base64Image.startsWith("data:image")) {
    return base64Image;
  }

  try {
    // Extract image data and extension
    const matches = base64Image.match(
      /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/
    );
    if (!matches || matches.length !== 3) {
      console.log("Invalid image format");
      return "https://placehold.co/600x400?text=Invalid+Image";
    }

    const extension = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, "base64");

    // Generate random filename to avoid collisions
    const randomFilename = crypto.randomBytes(16).toString("hex");
    const filename = `${randomFilename}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Save to file
    fs.writeFileSync(filepath, buffer);
    console.log(`Image saved to ${filepath}`);

    // Return the URL to access this file
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return "https://placehold.co/600x400?text=Error+Saving+Image";
  }
};

// Helper function to delete image file
const deleteImageFile = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) {
    return;
  }

  try {
    const filename = imageUrl.split("/").pop();
    const filepath = path.join(uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`Image deleted: ${filepath}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Blog Post Controllers
export const createBlogPost = async (req, res) => {
  try {
    console.log("Received blog post request:", req.body);
    const { title, author, imageUrl, excerpt, content, tags } = req.body;

    if (!title || !author || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, author, excerpt, and content are required",
      });
    }

    // Save image to file if it's a base64 image
    const savedImageUrl = saveImageToFile(imageUrl);

    const blog = new BlogModel({
      title,
      author,
      imageUrl: savedImageUrl,
      excerpt,
      content,
      tags: tags || [],
    });

    console.log("Blog model created:", blog);
    const response = await createBlogPostQuery(blog);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("Blog Post Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllBlogPosts = async (req, res) => {
  try {
    const response = await getAllBlogPostsQuery();
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Get Blog Posts Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add endpoint to get single blog post
export const getBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement getBlogPostQuery in your service
    const response = await getBlogPostQuery(id);
    return res.status(response.success ? 200 : 404).json(response);
  } catch (error) {
    console.error("Get Blog Post Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add endpoint to update blog post
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, imageUrl, excerpt, content, tags } = req.body;

    // Get the existing blog post to check if we need to delete an old image
    const existingPost = await getBlogPostQuery(id);

    if (!existingPost.success) {
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found" });
    }

    // Process image: if it's base64, save to file and get new URL
    let savedImageUrl = imageUrl;

    // If it's a new base64 image, save it and delete the old one
    if (imageUrl && imageUrl.startsWith("data:image")) {
      // Delete old image if it exists and is in our uploads directory
      if (
        existingPost.data.imageUrl &&
        existingPost.data.imageUrl.startsWith("/uploads/")
      ) {
        deleteImageFile(existingPost.data.imageUrl);
      }

      // Save new image
      savedImageUrl = saveImageToFile(imageUrl);
    }

    const updatedBlog = {
      title,
      author,
      imageUrl: savedImageUrl,
      excerpt,
      content,
      tags: tags || [],
    };

    // Implement updateBlogPostQuery in your service
    const response = await updateBlogPostQuery(id, updatedBlog);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Update Blog Post Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add endpoint to delete blog post
export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the post to delete its image
    const existingPost = await getBlogPostQuery(id);

    if (existingPost.success && existingPost.data.imageUrl) {
      deleteImageFile(existingPost.data.imageUrl);
    }

    // Implement deleteBlogPostQuery in your service
    const response = await deleteBlogPostQuery(id);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Delete Blog Post Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// News Article Controllers
export const createNewsArticle = async (req, res) => {
  try {
    console.log("Received news article request:", req.body);
    const { title, author, imageUrl, excerpt, content, tags } = req.body;

    if (!title || !author || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, author, excerpt, and content are required",
      });
    }

    // Save image to file if it's a base64 image
    const savedImageUrl = saveImageToFile(imageUrl);

    const news = new NewsModel({
      title,
      author,
      imageUrl: savedImageUrl,
      excerpt,
      content,
      tags: tags || [],
    });

    console.log("News model created:", news);
    const response = await createNewsArticleQuery(news);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("News Article Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllNewsArticles = async (req, res) => {
  try {
    const response = await getAllNewsArticlesQuery();
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Get News Articles Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// News Article single endpoints
export const getNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getNewsArticleQuery(id);
    return res.status(response.success ? 200 : 404).json(response);
  } catch (error) {
    console.error("Get News Article Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, imageUrl, excerpt, content, tags } = req.body;

    if (!title || !author || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, author, excerpt, and content are required",
      });
    }

    // Get existing news article to check image
    const existingNews = await getNewsArticleQuery(id);

    if (!existingNews.success) {
      return res
        .status(404)
        .json({ success: false, message: "News article not found" });
    }

    // Process image: if it's base64, save to file and get new URL
    let savedImageUrl = imageUrl;

    // If it's a new base64 image, save it and delete the old one
    if (imageUrl && imageUrl.startsWith("data:image")) {
      // Delete old image if it exists and is in our uploads directory
      if (
        existingNews.data.imageUrl &&
        existingNews.data.imageUrl.startsWith("/uploads/")
      ) {
        deleteImageFile(existingNews.data.imageUrl);
      }

      // Save new image
      savedImageUrl = saveImageToFile(imageUrl);
    }

    const updatedNews = {
      title,
      author,
      imageUrl: savedImageUrl,
      excerpt,
      content,
      tags: tags || [],
    };

    const response = await updateNewsArticleQuery(id, updatedNews);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Update News Article Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the news article to delete its image
    const existingNews = await getNewsArticleQuery(id);

    if (existingNews.success && existingNews.data.imageUrl) {
      deleteImageFile(existingNews.data.imageUrl);
    }

    const response = await deleteNewsArticleQuery(id);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Delete News Article Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Story Controllers
export const createStory = async (req, res) => {
  try {
    console.log("Received story request:", req.body);
    const { title, author, imageUrl, excerpt, content, tags } = req.body;

    if (!title || !author || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, author, excerpt, and content are required",
      });
    }

    // Save image to file if it's a base64 image
    const savedImageUrl = saveImageToFile(imageUrl);

    const story = new StoryModel({
      title,
      author,
      imageUrl: savedImageUrl,
      excerpt,
      content,
      tags: tags || [],
    });

    console.log("Story model created:", story);
    const response = await createStoryQuery(story);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("Story Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const response = await getAllStoriesQuery();
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Get Stories Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Story single endpoints
export const getStory = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getStoryQuery(id);
    return res.status(response.success ? 200 : 404).json(response);
  } catch (error) {
    console.error("Get Story Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, imageUrl, excerpt, content, tags } = req.body;

    if (!title || !author || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, author, excerpt, and content are required",
      });
    }

    // Get existing story to check image
    const existingStory = await getStoryQuery(id);

    if (!existingStory.success) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    // Process image: if it's base64, save to file and get new URL
    let savedImageUrl = imageUrl;

    // If it's a new base64 image, save it and delete the old one
    if (imageUrl && imageUrl.startsWith("data:image")) {
      // Delete old image if it exists and is in our uploads directory
      if (
        existingStory.data.imageUrl &&
        existingStory.data.imageUrl.startsWith("/uploads/")
      ) {
        deleteImageFile(existingStory.data.imageUrl);
      }

      // Save new image
      savedImageUrl = saveImageToFile(imageUrl);
    }

    const updatedStory = {
      title,
      author,
      imageUrl: savedImageUrl,
      excerpt,
      content,
      tags: tags || [],
    };

    const response = await updateStoryQuery(id, updatedStory);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Update Story Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the story to delete its image
    const existingStory = await getStoryQuery(id);

    if (existingStory.success && existingStory.data.imageUrl) {
      deleteImageFile(existingStory.data.imageUrl);
    }

    const response = await deleteStoryQuery(id);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Delete Story Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Related posts controller
export const getRelatedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 3;
    const category = req.path.split("/")[1]; // Extract category from URL path

    // Check if tags were provided in the request query
    let tags = [];
    if (req.query.tags) {
      try {
        tags = JSON.parse(decodeURIComponent(req.query.tags));
        // If tags are provided, we can use them directly
        if (Array.isArray(tags) && tags.length > 0) {
          console.log("Using tags from request:", tags);

          // Get all posts from ALL categories
          const blogPosts = await getAllBlogPostsQuery();
          const newsPosts = await getAllNewsArticlesQuery();
          const storyPosts = await getAllStoriesQuery();

          // Combine all posts
          let allPosts = [];
          if (blogPosts.success) {
            allPosts = allPosts.concat(
              blogPosts.data.map((post) => ({ ...post, category: "blog" }))
            );
          }
          if (newsPosts.success) {
            allPosts = allPosts.concat(
              newsPosts.data.map((post) => ({ ...post, category: "news" }))
            );
          }
          if (storyPosts.success) {
            allPosts = allPosts.concat(
              storyPosts.data.map((post) => ({ ...post, category: "story" }))
            );
          }

          if (allPosts.length === 0) {
            return res.status(200).json({
              success: true,
              data: [],
              message: "No posts found to relate to",
            });
          }

          // Filter out the current post and sort by tag relevance
          const relatedPosts = allPosts
            .filter((post) => post.id.toString() !== id)
            .map((post) => {
              // Calculate relevance score based on matching tags
              const postTags = post.tags || [];
              const matchingTags = postTags.filter((tag) =>
                tags.some((t) => t.toLowerCase() === tag.toLowerCase())
              );
              const relevanceScore = matchingTags.length;

              // Include ALL posts, even without matching tags
              return {
                ...post,
                relevanceScore,
                matchingTags,
              };
            })
            .sort((a, b) => {
              // Sort by relevance score (descending)
              if (b.relevanceScore !== a.relevanceScore) {
                return b.relevanceScore - a.relevanceScore;
              }
              // If relevance is the same, sort by date (newest first)
              return (
                new Date(b.created_at || b.createdAt) -
                new Date(a.created_at || a.createdAt)
              );
            })
            .slice(0, limit);

          return res.status(200).json({
            success: true,
            data: relatedPosts,
          });
        }
      } catch (error) {
        console.error("Error parsing tags from query:", error);
        // Continue with the regular flow if there's an error parsing tags
      }
    }

    // If no tags in request or error parsing, fall back to getting tags from the post
    let currentPost;
    if (category === "blog") {
      currentPost = await getBlogPostQuery(id);
    } else if (category === "news") {
      currentPost = await getNewsArticleQuery(id); // Use the correct query
    } else if (category === "story") {
      currentPost = await getStoryQuery(id); // Use the correct query
    }

    if (!currentPost.success) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Use tags from the post if no tags were provided in the request
    tags = currentPost.data.tags || [];

    // If no tags, we can't find related posts
    if (tags.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No tags to match related posts",
      });
    }

    // Get all posts from ALL categories
    const blogPosts = await getAllBlogPostsQuery();
    const newsPosts = await getAllNewsArticlesQuery();
    const storyPosts = await getAllStoriesQuery();

    // Combine all posts
    let allPosts = [];
    if (blogPosts.success) {
      allPosts = allPosts.concat(
        blogPosts.data.map((post) => ({ ...post, category: "blog" }))
      );
    }
    if (newsPosts.success) {
      allPosts = allPosts.concat(
        newsPosts.data.map((post) => ({ ...post, category: "news" }))
      );
    }
    if (storyPosts.success) {
      allPosts = allPosts.concat(
        storyPosts.data.map((post) => ({ ...post, category: "story" }))
      );
    }

    if (allPosts.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No posts found to relate to",
      });
    }

    // Filter out the current post and sort by tag relevance
    const relatedPosts = allPosts
      .filter((post) => post.id.toString() !== id) // Use id instead of _id since we're using SQL
      .map((post) => {
        // Calculate relevance score based on matching tags
        const postTags = post.tags || [];
        const matchingTags = postTags.filter((tag) =>
          tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
        const relevanceScore = matchingTags.length;

        // We've added category to each post above
        return {
          ...post,
          relevanceScore,
          matchingTags,
        };
      })
      .sort((a, b) => {
        // Sort by relevance score (descending)
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        // If relevance is the same, sort by date (newest first)
        return (
          new Date(b.created_at || b.createdAt) -
          new Date(a.created_at || a.createdAt)
        );
      })
      .slice(0, limit); // Take only the requested number of related posts

    return res.status(200).json({
      success: true,
      data: relatedPosts,
    });
  } catch (error) {
    console.error("Get Related Posts Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
