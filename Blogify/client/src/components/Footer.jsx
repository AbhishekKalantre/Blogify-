import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-100 py-10 px-6 md:px-12 lg:px-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="text-2xl font-bold text-white">Blogify</div>

        {/* Navigation Links */}
        <div className="flex gap-6 text-lg font-medium text-white">
          <Link to="/" className="hover:text-indigo-300 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-indigo-300 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-300 transition">
            Contact
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 text-white">
          <a href="#" className="hover:text-indigo-300 transition">
            <Facebook />
          </a>
          <a href="#" className="hover:text-indigo-300 transition">
            <Twitter />
          </a>
          <a href="#" className="hover:text-indigo-300 transition">
            <Instagram />
          </a>
          <a href="#" className="hover:text-indigo-300 transition">
            <Linkedin />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm mt-8 text-gray-400">
        © {new Date().getFullYear()} Blogify. Made with ❤️ by Akash.
      </div>
    </footer>
  );
};

export default Footer;
