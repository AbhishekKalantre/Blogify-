import React from "react";
import { motion } from "framer-motion";
import { AtSign } from "lucide-react";

const AuthorInfo = ({ author, getInitials, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="bg-gray-50 rounded-xl p-6 mb-12 flex items-center gap-4"
    >
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-medium">
        {getInitials(author)}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {author}
          <AtSign size={16} className="text-indigo-500" />
        </h3>
        <p className="text-gray-600">
          Author of insightful content on our platform
        </p>
      </div>
    </motion.div>
  );
};

export default AuthorInfo;
