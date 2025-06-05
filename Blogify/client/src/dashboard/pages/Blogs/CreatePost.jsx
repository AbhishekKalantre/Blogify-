import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine the default category based on the previous path
  const getDefaultCategory = () => {
    const prevPath = location.state?.from || "";
    if (prevPath.includes("/dashboard/news")) return "news";
    if (prevPath.includes("/dashboard/stories")) return "story";
    return "blog"; // Default to blog if no matching path
  };

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: getDefaultCategory(), // Set default category based on navigation
    imageUrl: "",
    excerpt: "",
    content: "",
    tags: [],
  });

  // Fetch available tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/tags");
        if (response.data.success) {
          setAvailableTags(response.data.data);
        } else {
          toast.error("Failed to fetch tags");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("An error occurred while fetching tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Update category when navigation changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      category: getDefaultCategory(),
    }));
  }, [location]);

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
          imageUrl: reader.result, // In a real app, you'd upload to a server and get a URL
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
        endpoint = "/api/posts/blog";
      } else if (formData.category === "news") {
        endpoint = "/api/posts/news";
      } else if (formData.category === "story") {
        endpoint = "/api/posts/story";
      }

      // Create a copy of formData without the category field
      const { category, ...postData } = formData; // eslint-disable-line no-unused-vars

      console.log("Sending request to:", `http://localhost:3000${endpoint}`);
      console.log("Request data:", JSON.stringify(postData));

      // Send the post data to the API
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (data.success) {
        toast.success(data.message || "Post created successfully!");

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
        toast.error(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating the post");
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 md:p-8 rounded-xl shadow-md text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Create New Post</h1>
        <p className="opacity-90">
          Add a new blog post, news article, or story
        </p>
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
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
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
                      onClick={() => {
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Publish Post
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreatePost;
