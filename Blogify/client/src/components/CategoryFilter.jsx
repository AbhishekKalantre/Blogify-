import React from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Newspaper } from "lucide-react";

const { div: MotionDiv } = motion;

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  // Define categories with their icons and styles
  const categories = [
    {
      id: "all",
      name: "All",
      icon: null,
      activeClass: "bg-gray-700 text-white",
      hoverClass: "hover:bg-gray-200",
    },
    {
      id: "blog",
      name: "Blogs",
      icon: <BookOpen size={16} />,
      activeClass: "bg-blue-600 text-white",
      hoverClass: "hover:bg-blue-100",
    },
    {
      id: "story",
      name: "Stories",
      icon: <FileText size={16} />,
      activeClass: "bg-purple-600 text-white",
      hoverClass: "hover:bg-purple-100",
    },
    {
      id: "news",
      name: "News",
      icon: <Newspaper size={16} />,
      activeClass: "bg-green-600 text-white",
      hoverClass: "hover:bg-green-100",
    },
  ];

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-2 justify-center mb-12"
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all
            ${
              activeCategory === category.id
                ? category.activeClass
                : "bg-gray-100 text-gray-700 " + category.hoverClass
            }`}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </MotionDiv>
  );
};

export default CategoryFilter;
