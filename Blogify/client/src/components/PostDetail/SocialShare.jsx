import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Share,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Check,
} from "lucide-react";

const SocialShare = ({ url, title, variants }) => {
  const [copied, setCopied] = useState(false);

  // Encode the title for URL parameters
  const encodedTitle = encodeURIComponent(title);

  // Get the current URL
  const shareUrl = url || window.location.href;

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Social media share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodedTitle}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
    `Check out this article: ${title}\n${shareUrl}`
  )}`;

  return (
    <motion.div variants={variants} className="mt-12 mb-12">
      <div className="flex items-center gap-3 mb-4">
        <Share size={20} className="text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800">Share this post</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-600" />
              <span className="text-sm font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy size={16} className="text-gray-600" />
              <span className="text-sm font-medium">Copy link</span>
            </>
          )}
        </button>

        {/* Facebook Share */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Facebook size={16} />
          <span className="text-sm font-medium">Facebook</span>
        </a>

        {/* Twitter Share */}
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          <Twitter size={16} />
          <span className="text-sm font-medium">Twitter</span>
        </a>

        {/* LinkedIn Share */}
        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors"
        >
          <Linkedin size={16} />
          <span className="text-sm font-medium">LinkedIn</span>
        </a>

        {/* Email Share */}
        <a
          href={emailShareUrl}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
        >
          <Mail size={16} />
          <span className="text-sm font-medium">Email</span>
        </a>
      </div>
    </motion.div>
  );
};

export default SocialShare;
