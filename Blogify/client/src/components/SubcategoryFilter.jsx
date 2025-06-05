import React, { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Hash } from "lucide-react";
import axios from "axios";

const { div: MotionDiv } = motion;

const SubcategoryFilter = ({
  category,
  activeSubcategory,
  onSubcategoryChange,
}) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tags");
        if (response.data.success) {
          setTags(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Define subcategories for each main category
  const subcategories = useMemo(() => {
    // Default "All" option for any category
    const allOption = { id: "all", name: "All" };

    if (loading || tags.length === 0) {
      // Use default hard-coded values while loading
      const categorySubcategories = {
        blog: [
          allOption,
          { id: "tech", name: "Technology" },
          { id: "programming", name: "Programming" },
          { id: "coding", name: "Coding" },
        ],
        story: [
          allOption,
          { id: "fantasy", name: "Fantasy" },
          { id: "sci-fi", name: "Science Fiction" },
          { id: "mystery", name: "Mystery" },
          { id: "drama", name: "Drama" },
          { id: "coming-of-age", name: "Coming of Age" },
        ],
        news: [
          allOption,
          { id: "technology", name: "Technology" },
          { id: "web", name: "Web Development" },
          { id: "software", name: "Software" },
          { id: "ai", name: "Artificial Intelligence" },
          { id: "security", name: "Security" },
        ],
      };

      return categorySubcategories[category] || [allOption];
    } else {
      // Use API tags when available
      const tagItems = tags.map((tag) => ({
        id: tag.name.toLowerCase(),
        name: tag.name,
      }));

      return [allOption, ...tagItems];
    }
  }, [category, tags, loading]);

  // Define color scheme based on main category
  const getCategoryColorScheme = () => {
    switch (category) {
      case "blog":
        return {
          active: "bg-blue-600 text-white",
          hover: "hover:bg-blue-100",
          icon: "text-blue-500",
        };
      case "story":
        return {
          active: "bg-purple-600 text-white",
          hover: "hover:bg-purple-100",
          icon: "text-purple-500",
        };
      case "news":
        return {
          active: "bg-green-600 text-white",
          hover: "hover:bg-green-100",
          icon: "text-green-500",
        };
      default:
        return {
          active: "bg-gray-700 text-white",
          hover: "hover:bg-gray-100",
          icon: "text-gray-500",
        };
    }
  };

  const colorScheme = getCategoryColorScheme();

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-2 justify-center mb-8"
    >
      {subcategories.map((subcategory) => (
        <button
          key={subcategory.id}
          onClick={() => onSubcategoryChange(subcategory.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all
            ${
              activeSubcategory === subcategory.id
                ? colorScheme.active
                : `bg-gray-100 text-gray-700 ${colorScheme.hover}`
            }`}
        >
          {subcategory.id !== "all" && (
            <Hash
              size={14}
              className={
                activeSubcategory === subcategory.id
                  ? "text-white"
                  : colorScheme.icon
              }
            />
          )}
          {subcategory.name}
        </button>
      ))}
    </MotionDiv>
  );
};

export default SubcategoryFilter;
