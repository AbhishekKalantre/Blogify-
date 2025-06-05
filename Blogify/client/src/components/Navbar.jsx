import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  Newspaper,
  FileText,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showContentMenu) setShowContentMenu(false);
  };
  const toggleContentMenu = () => {
    setShowContentMenu(!showContentMenu);
    if (showUserMenu) setShowUserMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-md py-4 px-6 md:px-12 lg:px-20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-tight"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
            Blogify
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-white font-medium text-lg">
          <Link to="/" className="hover:text-indigo-300 transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-indigo-300 transition-colors">
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-indigo-300 transition-colors"
          >
            Contact
          </Link>

          {/* Content Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleContentMenu}
              className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
            >
              Explore
              <ChevronDown size={16} />
            </button>

            {showContentMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/blogs"
                  className="px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center gap-2"
                  onClick={() => setShowContentMenu(false)}
                >
                  <BookOpen size={16} />
                  Blogs
                </Link>
                <Link
                  to="/stories"
                  className="px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center gap-2"
                  onClick={() => setShowContentMenu(false)}
                >
                  <FileText size={16} />
                  Stories
                </Link>
                <Link
                  to="/news"
                  className="px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center gap-2"
                  onClick={() => setShowContentMenu(false)}
                >
                  <Newspaper size={16} />
                  News
                </Link>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
              >
                {user.username || user.firstName}
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/dashboard"
                    className=" px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className=" w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-indigo-300 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-indigo-300 transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden text-white font-medium text-lg">
          <Link
            to="/"
            onClick={closeMenu}
            className="hover:text-indigo-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="hover:text-indigo-300 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="hover:text-indigo-300 transition-colors"
          >
            Contact
          </Link>

          {/* Mobile Content Menu */}
          <div className="border-t border-gray-700 pt-2 pb-1">
            <p className="text-gray-400 text-sm mb-2">Explore Content</p>
            <Link
              to="/blogs"
              onClick={closeMenu}
              className="hover:text-indigo-300 transition-colors flex items-center gap-2 pl-2 py-1"
            >
              <BookOpen size={16} />
              Blogs
            </Link>
            <Link
              to="/stories"
              onClick={closeMenu}
              className="hover:text-indigo-300 transition-colors flex items-center gap-2 pl-2 py-1"
            >
              <FileText size={16} />
              Stories
            </Link>
            <Link
              to="/news"
              onClick={closeMenu}
              className="hover:text-indigo-300 transition-colors flex items-center gap-2 pl-2 py-1"
            >
              <Newspaper size={16} />
              News
            </Link>
          </div>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="hover:text-indigo-300 transition-colors flex items-center gap-2"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="text-left hover:text-indigo-300 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="hover:text-indigo-300 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
