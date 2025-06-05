import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ImagePlus,
  Tag as TagIcon,
  X,
  Save,
  FileText,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "blog",
    imageUrl: "",
    excerpt: "",
    content: "",
    tags: [],
  });

  // Fetch post data and available tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch available tags first
        const tagsResponse = await axios.get("http://localhost:3000/api/tags");
        if (tagsResponse.data.success) {
          setAvailableTags(tagsResponse.data.data);
        } else {
          toast.error("Failed to fetch tags");
        }

        // Then fetch post data
        await fetchPost();
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location]);

  const fetchPost = async () => {
    try {
      // First check if post data was passed via location state
      if (location.state && location.state.post) {
        const post = location.state.post;
        setFormData({
          ...post,
          // Ensure tags is an array
          tags: Array.isArray(post.tags) ? post.tags : [],
          // Make sure we have a category
          category: post.category || "blog",
        });
        setImagePreview(post.imageUrl);
        return;
      }

      // Otherwise fetch it from the API
      // We don't know which category this post belongs to, so try all endpoints
      const endpoints = [
        `/api/posts/blog/${id}`,
        `/api/posts/news/${id}`,
        `/api/posts/story/${id}`,
      ];

      // Try each endpoint until we find the post
      let foundPost = null;
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`http://localhost:3000${endpoint}`);

          console.log(`Response from ${endpoint}:`, response);

          if (response.data && response.data.success) {
            foundPost = response.data.data;

            // Determine category from endpoint
            let category = "blog";
            if (endpoint.includes("/news/")) {
              category = "news";
            } else if (endpoint.includes("/story/")) {
              category = "story";
            }

            foundPost.category = category;
            break;
          }
        } catch (err) {
          // Continue trying other endpoints
          console.log(`Error fetching from ${endpoint}:`, err);
        }
      }

      if (foundPost) {
        // Ensure tags is an array
        foundPost.tags = Array.isArray(foundPost.tags)
          ? foundPost.tags
          : typeof foundPost.tags === "string"
          ? JSON.parse(foundPost.tags)
          : [];

        setFormData(foundPost);
        setImagePreview(foundPost.imageUrl);
        setError(null);
      } else {
        setError("Post not found");
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          imageUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag selection
  const handleTagToggle = (tagName) => {
    const newTags = [...formData.tags];

    if (newTags.includes(tagName)) {
      // Remove tag if already selected
      const index = newTags.indexOf(tagName);
      newTags.splice(index, 1);
    } else {
      // Add tag if not already selected
      newTags.push(tagName);
    }

    setFormData({
      ...formData,
      tags: newTags,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.content ||
      !formData.author ||
      !formData.excerpt
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Determine which API endpoint to use based on the category
      let endpoint = "";

      if (formData.category === "blog") {
        endpoint = `/api/posts/blog/${id}`;
      } else if (formData.category === "news") {
        endpoint = `/api/posts/news/${id}`;
      } else if (formData.category === "story") {
        endpoint = `/api/posts/story/${id}`;
      }

      // Create a copy of formData without the category field
      const { category: _category, ...postData } = formData;

      // Send the post data to the API
      const response = await axios.put(
        `http://localhost:3000${endpoint}`,
        postData
      );

      if (response.data && response.data.success) {
        toast.success("Post updated successfully!");

        // Redirect after a short delay to show the toast
        setTimeout(() => {
          if (formData.category === "blog") {
            navigate("/dashboard/blogs");
          } else if (formData.category === "news") {
            navigate("/dashboard/news");
          } else {
            navigate("/dashboard/stories");
          }
        }, 1500);
      } else {
        toast.error(response.data?.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("An error occurred while updating the post");
    }
  };

  // Function to find tag object by name
  const getTagByName = (tagName) => {
    return availableTags.find((tag) => tag.name === tagName) || null;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 md:p-8 rounded-xl shadow-md text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Post</h1>
        <p className="opacity-90">Update your content</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center text-center transition-all ${
                formData.category === "blog"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setFormData({ ...formData, category: "blog" })}
            >
              <FileText
                size={32}
                className={
                  formData.category === "blog"
                    ? "text-blue-500"
                    : "text-gray-400"
                }
              />
              <h3 className="font-medium mt-2">Blog Post</h3>
              <p className="text-xs text-gray-500 mt-1">
                Educational, informative content
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center text-center transition-all ${
                formData.category === "news"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setFormData({ ...formData, category: "news" })}
            >
              <Newspaper
                size={32}
                className={
                  formData.category === "news"
                    ? "text-green-500"
                    : "text-gray-400"
                }
              />
              <h3 className="font-medium mt-2">News Article</h3>
              <p className="text-xs text-gray-500 mt-1">
                Updates, announcements, events
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col items-center text-center transition-all ${
                formData.category === "story"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setFormData({ ...formData, category: "story" })}
            >
              <BookOpen
                size={32}
                className={
                  formData.category === "story"
                    ? "text-purple-500"
                    : "text-gray-400"
                }
              />
              <h3 className="font-medium mt-2">Story</h3>
              <p className="text-xs text-gray-500 mt-1">
                Narrative, personal content
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title and Author */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Author <span className="text-red-500">*</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image
            </label>
            <div
              className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => document.getElementById("image-upload").click()}
            >
              <div className="space-y-2 text-center">
                {imagePreview ? (
                  <div className="relative mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setFormData({ ...formData, imageUrl: "" });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center rounded-full bg-gray-100">
                      <ImagePlus size={24} />
                    </div>
                    <div className="text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        Click to upload
                      </label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Excerpt/Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="2"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief summary of your post"
              required
            ></textarea>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows="8"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your post content here..."
              required
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-3">
              {availableTags.length > 0 ? (
                availableTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        isSelected
                          ? "text-white"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={isSelected ? { backgroundColor: tag.color } : {}}
                    >
                      <TagIcon size={14} className="mr-1" />
                      {tag.name}
                      {isSelected && (
                        <X size={14} className="ml-1 text-white" />
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">
                  No tags available. Add tags in the Tags Manager first.
                </p>
              )}
            </div>
          </div>

          {/* Selected Tags Preview */}
          {formData.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tagName) => {
                  const tag = getTagByName(tagName);
                  return (
                    <span
                      key={tagName}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm text-white"
                      style={{ backgroundColor: tag?.color || "#6366F1" }}
                    >
                      <TagIcon size={14} className="mr-1" />
                      {tagName}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tagName)}
                        className="ml-1 text-white hover:text-gray-200"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Update Post
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditPost;
