import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Tag, Plus, X, Edit, Trash2, Check } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const TagsManager = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [tagFormData, setTagFormData] = useState({
    name: "",
    description: "",
    color: "#6366F1",
  });
  const [tagUsage, setTagUsage] = useState({});

  // Predefined colors for the color picker
  const predefinedColors = [
    "#2563eb", // blue
    "#7c3aed", // purple
    "#16a34a", // green
    "#ca8a04", // yellow
    "#db2777", // pink
    "#dc2626", // red
    "#0891b2", // cyan
    "#9333ea", // violet
    "#6366F1", // indigo
    "#71717a", // gray
  ];

  // Fetch all tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/tags");
      if (response.data.success) {
        setTags(response.data.data);
      } else {
        toast.error("Failed to fetch tags");
      }

      // Fetch tag usage data
      const usageResponse = await axios.get(
        "http://localhost:3000/api/tags/usage"
      );
      if (usageResponse.data.success) {
        const usageMap = {};
        usageResponse.data.data.forEach((item) => {
          usageMap[item.tag] = item.count;
        });
        setTagUsage(usageMap);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("An error occurred while fetching tags");
    } finally {
      setLoading(false);
    }
  };

  // Load tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTagFormData({
      ...tagFormData,
      [name]: value,
    });
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setTagFormData({
      ...tagFormData,
      color,
    });
  };

  // Reset form data
  const resetForm = () => {
    setTagFormData({
      name: "",
      description: "",
      color: "#6366F1",
    });
    setEditingTagId(null);
  };

  // Toggle tag form visibility
  const toggleTagForm = () => {
    setShowTagForm(!showTagForm);
    resetForm();
  };

  // Set up form for editing
  const editTag = (tag) => {
    setTagFormData({
      name: tag.name,
      description: tag.description || "",
      color: tag.color || "#6366F1",
    });
    setEditingTagId(tag.id);
    setShowTagForm(true);
  };

  // Submit the form to create or update a tag
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tagFormData.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      let response;
      if (editingTagId) {
        // Update existing tag
        response = await axios.put(
          `http://localhost:3000/api/tags/${editingTagId}`,
          tagFormData
        );
        toast.success("Tag updated successfully");
      } else {
        // Create new tag
        response = await axios.post(
          "http://localhost:3000/api/tags",
          tagFormData
        );
        toast.success("Tag created successfully");
      }

      if (response.data.success) {
        resetForm();
        setShowTagForm(false);
        fetchTags();
      } else {
        toast.error(response.data.message || "Failed to save tag");
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving the tag"
      );
    }
  };

  // Delete a tag
  const deleteTag = async (id, tagName) => {
    // Check if tag is in use
    if (tagUsage[tagName] && tagUsage[tagName] > 0) {
      toast.warning(
        `Cannot delete tag "${tagName}" because it is used in ${tagUsage[tagName]} posts.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to delete this tag?`)) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/tags/${id}`
        );
        if (response.data.success) {
          toast.success("Tag deleted successfully");
          fetchTags();
        } else {
          toast.error(response.data.message || "Failed to delete tag");
        }
      } catch (error) {
        console.error("Error deleting tag:", error);
        toast.error("An error occurred while deleting the tag");
      }
    }
  };

  // Render a color badge for previewing the tag
  const ColorBadge = ({ color, name, onClick }) => (
    <div
      className={`h-8 w-8 rounded-full cursor-pointer border-2 ${
        color === tagFormData.color ? "border-gray-800" : "border-transparent"
      }`}
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
      title={name}
    />
  );

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 md:p-8 rounded-xl shadow-md text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Tags Manager</h1>
        <p className="opacity-90">
          Create and manage tags to categorize your content
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {showTagForm
              ? editingTagId
                ? "Edit Tag"
                : "Create New Tag"
              : "All Tags"}
          </h2>
          <button
            onClick={toggleTagForm}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showTagForm
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {showTagForm ? (
              <>
                <X size={18} /> Cancel
              </>
            ) : (
              <>
                <Plus size={18} /> New Tag
              </>
            )}
          </button>
        </div>

        {showTagForm ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={tagFormData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter tag name (e.g., technology, health)"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                value={tagFormData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of what this tag represents"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag Color
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {predefinedColors.map((color) => (
                  <ColorBadge
                    key={color}
                    color={color}
                    onClick={handleColorSelect}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={tagFormData.color}
                  onChange={handleChange}
                  className="h-10 w-20 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Preview:</span>
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm text-white"
                      style={{ backgroundColor: tagFormData.color }}
                    >
                      <Tag size={14} className="mr-1" />
                      {tagFormData.name || "Tag Preview"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={toggleTagForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Check size={18} />
                {editingTagId ? "Update Tag" : "Create Tag"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            {tags.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tag
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Usage
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tags.map((tag) => (
                      <tr key={tag.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              <Tag size={14} className="mr-1" />
                              {tag.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {tag.description || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {tagUsage[tag.name] || 0} posts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => editTag(tag)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteTag(tag.id, tag.name)}
                              className={`text-red-600 hover:text-red-900 ${
                                tagUsage[tag.name] > 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={tagUsage[tag.name] > 0}
                              title={
                                tagUsage[tag.name] > 0
                                  ? "Cannot delete: Tag is in use"
                                  : "Delete tag"
                              }
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Tags Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by creating your first tag to categorize your content.
                </p>
                <button
                  onClick={toggleTagForm}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={18} /> Create First Tag
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TagsManager;
