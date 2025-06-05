import {
  BarChart3,
  Users,
  MessagesSquare,
  FileText,
  Newspaper,
  BookOpen,
  Tag,
  Eye,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    news: 0,
    stories: 0,
    users: 0,
    comments: 0,
    tags: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats from backend using Promise.all for parallel requests
      const [blogRes, newsRes, storiesRes, usersRes, tagsRes] =
        await Promise.all([
          axios.get("/api/posts/blogs").catch(() => ({ data: [] })),
          axios.get("/api/posts/news").catch(() => ({ data: [] })),
          axios.get("/api/posts/stories").catch(() => ({ data: [] })),
          axios.get("/api/users").catch(() => ({ data: [] })),
          axios.get("/api/tags").catch(() => ({ data: [] })),
        ]);

      // Process blog data with safety checks
      const blogs = Array.isArray(blogRes.data)
        ? blogRes.data
        : blogRes.data?.data || blogRes.data?.blogs || [];

      // Process news data with safety checks
      const news = Array.isArray(newsRes.data)
        ? newsRes.data
        : newsRes.data?.data || newsRes.data?.news || [];

      // Process stories data with safety checks
      const stories = Array.isArray(storiesRes.data)
        ? storiesRes.data
        : storiesRes.data?.data || storiesRes.data?.stories || [];

      // Process users data with safety checks
      const users = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data?.data || usersRes.data?.users || [];

      // Process tags data with safety checks
      const tags = Array.isArray(tagsRes.data)
        ? tagsRes.data
        : tagsRes.data?.data || tagsRes.data?.tags || [];

      // Calculate total views (summing views from all content types)
      const totalViews = [...blogs, ...news, ...stories].reduce(
        (total, item) => total + (parseInt(item.views) || 0),
        0
      );

      // Get comments count (if your blog items have comments array)
      const commentsCount = [...blogs, ...news, ...stories].reduce(
        (total, item) =>
          total + (Array.isArray(item.comments) ? item.comments.length : 0),
        0
      );

      // Log data for debugging
      console.log("Dashboard data loaded:", {
        blogs,
        news,
        stories,
        users,
        tags,
      });

      // Set stats with real data
      setStats({
        blogs: blogs.length,
        news: news.length,
        stories: stories.length,
        users: users.length,
        comments: commentsCount,
        tags: tags.length,
        views: totalViews,
      });

      // Get recent posts (combine and sort all content types)
      const allPosts = [
        ...blogs.map((blog) => ({ ...blog, type: "blog" })),
        ...news.map((newsItem) => ({ ...newsItem, type: "news" })),
        ...stories.map((story) => ({ ...story, type: "story" })),
      ];

      // Sort by date (newest first) and take the first 5
      const sortedPosts = allPosts
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at || 0) -
            new Date(a.createdAt || a.created_at || 0)
        )
        .slice(0, 5)
        .map((post) => ({
          id: post.id || post._id,
          title: post.title,
          type: post.type,
          views: post.views || 0,
          date: formatDate(post.createdAt || post.created_at || new Date()),
        }));

      setRecentPosts(sortedPosts);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try refreshing.");

      // If API call fails, fall back to mock data
      setStats({
        blogs: 25,
        news: 12,
        stories: 8,
        users: 145,
        comments: 238,
        tags: 32,
        views: 12580,
      });

      setRecentPosts([
        {
          id: 1,
          title: "Getting Started with React",
          type: "blog",
          views: 256,
          date: "2 hours ago",
        },
        {
          id: 2,
          title: "Latest Tech Industry Updates",
          type: "news",
          views: 189,
          date: "5 hours ago",
        },
        {
          id: 3,
          title: "My Journey as a Developer",
          type: "story",
          views: 102,
          date: "1 day ago",
        },
        {
          id: 4,
          title: "10 Tips for Better Code",
          type: "blog",
          views: 320,
          date: "2 days ago",
        },
        {
          id: 5,
          title: "AI Breakthroughs This Week",
          type: "news",
          views: 415,
          date: "3 days ago",
        },
      ]);

      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up an interval to refresh data every 5 minutes
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // Helper function to format dates relative to now (e.g., "2 hours ago")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (isNaN(diffInSeconds)) return "unknown date";

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const statCards = [
    {
      title: "Blog Posts",
      value: stats.blogs,
      icon: <FileText />,
      change: "+8%",
      color: "blue",
      link: "/dashboard/blogs",
    },
    {
      title: "News Articles",
      value: stats.news,
      icon: <Newspaper />,
      change: "+12%",
      color: "green",
      link: "/dashboard/news",
    },
    {
      title: "Stories",
      value: stats.stories,
      icon: <BookOpen />,
      change: "+5%",
      color: "purple",
      link: "/dashboard/stories",
    },
    {
      title: "Comments",
      value: stats.comments,
      icon: <MessagesSquare />,
      change: "+15%",
      color: "yellow",
      link: "#",
    },
    {
      title: "Users",
      value: stats.users,
      icon: <Users />,
      change: "+3%",
      color: "indigo",
      link: "#",
    },
    {
      title: "Tags",
      value: stats.tags,
      icon: <Tag />,
      change: "+6%",
      color: "teal",
      link: "/dashboard/tags",
    },
    {
      title: "Total Views",
      value: stats.views.toLocaleString(),
      icon: <Eye />,
      change: "+25%",
      color: "pink",
      link: "#",
    },
  ];

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Refresh Button */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
              Welcome to Blog Management Dashboard
            </h1>
            <p className="text-sm md:text-base opacity-90">
              Manage your blogs, news articles, stories, and more from one
              central location.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <RefreshCw
              size={20}
              className={`text-white ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/dashboard/create-post"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FileText className="mb-2" />
          <span className="text-sm font-medium">New Blog</span>
        </Link>
        <Link
          to="/dashboard/create-post"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Newspaper className="mb-2" />
          <span className="text-sm font-medium">New News</span>
        </Link>
        <Link
          to="/dashboard/create-post"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <BookOpen className="mb-2" />
          <span className="text-sm font-medium">New Story</span>
        </Link>
        <Link
          to="/dashboard/tags"
          className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Tag className="mb-2" />
          <span className="text-sm font-medium">Manage Tags</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.slice(0, 4).map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
          >
            {refreshing && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2 md:p-3 rounded-lg bg-${stat.color}-100`}>
                <div className={`text-${stat.color}-600`}>{stat.icon}</div>
              </div>
              <span
                className={`text-${stat.color}-600 font-semibold text-xs md:text-sm flex items-center`}
              >
                {stat.change}
                <TrendingUp size={16} className="ml-1" />
              </span>
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm font-medium">
              {stat.title}
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Second row of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {statCards.slice(4).map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
          >
            {refreshing && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2 md:p-3 rounded-lg bg-${stat.color}-100`}>
                <div className={`text-${stat.color}-600`}>{stat.icon}</div>
              </div>
              <span
                className={`text-${stat.color}-600 font-semibold text-xs md:text-sm flex items-center`}
              >
                {stat.change}
                <TrendingUp size={16} className="ml-1" />
              </span>
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm font-medium">
              {stat.title}
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Charts and Recent Posts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">
              Content Performance
            </h2>
            <div className="flex items-center p-1.5 md:p-2 bg-gray-100 rounded-lg text-xs md:text-sm">
              <span className="text-gray-600">Last 7 Days</span>
              <svg
                className="w-3 h-3 md:w-4 md:h-4 ml-1 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-center h-48 md:h-64">
            <BarChart3 size={120} className="text-gray-300 md:hidden" />
            <BarChart3 size={180} className="text-gray-300 hidden md:block" />
            <p className="text-xs md:text-sm text-gray-500 absolute">
              Content performance visualization would appear here
            </p>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">
              Recent Posts
            </h2>
            <button className="text-blue-600 text-xs md:text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {recentPosts.map((post, index) => (
              <div
                key={index}
                className="flex items-start gap-2 md:gap-3 pb-3 md:pb-4 border-b border-gray-100 last:border-0"
              >
                <div
                  className={`p-1.5 md:p-2 rounded-full 
                  ${
                    post.type === "blog"
                      ? "bg-blue-100"
                      : post.type === "news"
                      ? "bg-green-100"
                      : "bg-purple-100"
                  }`}
                >
                  {post.type === "blog" ? (
                    <FileText size={14} className={`text-blue-600 md:hidden`} />
                  ) : post.type === "news" ? (
                    <Newspaper
                      size={14}
                      className={`text-green-600 md:hidden`}
                    />
                  ) : (
                    <BookOpen
                      size={14}
                      className={`text-purple-600 md:hidden`}
                    />
                  )}

                  {post.type === "blog" ? (
                    <FileText
                      size={16}
                      className={`text-blue-600 hidden md:block`}
                    />
                  ) : post.type === "news" ? (
                    <Newspaper
                      size={16}
                      className={`text-green-600 hidden md:block`}
                    />
                  ) : (
                    <BookOpen
                      size={16}
                      className={`text-purple-600 hidden md:block`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between w-full">
                    <p className="text-xs md:text-sm font-medium text-gray-800 line-clamp-1">
                      {post.title}
                    </p>
                    <span className="text-xs text-gray-500 flex items-center ml-2 whitespace-nowrap">
                      <Eye size={12} className="mr-1" /> {post.views}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{post.type}</p>
                  <p className="text-xs text-gray-400 mt-0.5 md:mt-1 flex items-center">
                    <Clock size={10} className="mr-1" /> {post.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
