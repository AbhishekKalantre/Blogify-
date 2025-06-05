import { useState, useEffect } from "react";
import {
  Home,
  LogOut,
  User,
  X,
  FileText,
  Newspaper,
  BookOpen,
  Plus,
  Tag,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPortal } from "react-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") {
      setActiveTab("Dashboard");
    } else if (path.includes("/dashboard/blogs")) {
      setActiveTab("Blogs");
    } else if (path.includes("/dashboard/news")) {
      setActiveTab("News");
    } else if (path.includes("/dashboard/stories")) {
      setActiveTab("Stories");
    } else if (path.includes("/dashboard/create-post")) {
      setActiveTab("Create Post");
    } else if (path.includes("/dashboard/profile")) {
      setActiveTab("Profile");
    } else if (path.includes("/dashboard/tags")) {
      setActiveTab("Tags");
    } else if (path.includes("/dashboard/view-post")) {
      // Keep the active tab as is when viewing a post
    } else if (path.includes("/dashboard/edit-post")) {
      // Keep the active tab as is when editing a post
    }
  }, [location.pathname]);

  // Handle navigation to create post with current location as state
  const handleCreatePostClick = () => {
    setActiveTab("Create Post");
    if (window.innerWidth < 1024) toggleSidebar();
    navigate("/dashboard/create-post", { state: { from: location.pathname } });
  };

  const menuItems = [
    {
      name: "Blogs",
      icon: <FileText size={20} />,
      path: "/dashboard/blogs",
    },
    { name: "News", icon: <Newspaper size={20} />, path: "/dashboard/news" },
    {
      name: "Stories",
      icon: <BookOpen size={20} />,
      path: "/dashboard/stories",
    },
  ];

  const initiateLogout = () => {
    setShowConfirmLogout(true);
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  const confirmLogout = () => {
    try {
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");

      // Delay navigation slightly to show the toast
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("There was a problem logging out. Please try again.");
    }
  };

  // Logout Confirmation Dialog with Portal
  const LogoutConfirmDialog = () => {
    if (!showConfirmLogout) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelLogout}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Determine sidebar class based on isOpen state
  const sidebarClass = isOpen
    ? "translate-x-0 opacity-100"
    : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100";

  return (
    <>
      <aside
        className={`w-64 h-screen fixed bg-gradient-to-b from-white to-gray-50 backdrop-blur-md shadow-xl 
        border-r border-gray-200 p-6 flex flex-col z-30 transition-all duration-300 ease-in-out ${sidebarClass}`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo & Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          {/* Dashboard */}
          <Link to="/dashboard">
            <button
              onClick={() => {
                setActiveTab("Dashboard");
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center gap-4 p-3 w-full rounded-lg text-sm font-medium transition-all mb-2
                ${
                  activeTab === "Dashboard"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Home size={20} /> <span>Dashboard</span>
            </button>
          </Link>

          {/* Create Post Button */}
          <button
            onClick={handleCreatePostClick}
            className={`flex items-center gap-4 p-3 w-full rounded-lg text-sm font-medium transition-all mb-2
              ${
                activeTab === "Create Post"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
          >
            <Plus size={20} /> <span>Create Post</span>
          </button>

          {/* Tags Manager Button */}
          <Link to="/dashboard/tags">
            <button
              onClick={() => {
                setActiveTab("Tags");
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center gap-4 p-3 w-full rounded-lg text-sm font-medium transition-all mb-2
                ${
                  activeTab === "Tags"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Tag size={20} /> <span>Tags Manager</span>
            </button>
          </Link>

          {/* Other Menu Items */}
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path}>
              <button
                onClick={() => {
                  setActiveTab(item.name);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center gap-4 p-3 w-full rounded-lg text-sm font-medium transition-all mb-2
                  ${
                    activeTab === item.name
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                {item.icon} <span>{item.name}</span>
              </button>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 pt-4 mt-4">
          {/* Profile Button */}
          <Link to="/dashboard/profile">
            <button
              onClick={() => {
                setActiveTab("Profile");
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center gap-4 p-3 w-full rounded-lg text-sm font-medium transition-all mb-3
                ${
                  activeTab === "Profile"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <User size={20} /> <span>Profile</span>
            </button>
          </Link>

          {/* Logout Button */}
          <button
            onClick={initiateLogout}
            className="flex items-center gap-3 p-3 w-full text-red-600 font-medium hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
        />
      </aside>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Render the logout confirmation dialog using portal */}
      <LogoutConfirmDialog />
    </>
  );
};

export default Sidebar;
