import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userString = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userString || !token) {
          // Clear potentially incomplete auth data
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
          return;
        }

        const user = JSON.parse(userString);
        if (user && user.id) {
          setAuthStatus({ isAuthenticated: true, isLoading: false, user });
        } else {
          // Invalid user data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthStatus({ isAuthenticated: false, isLoading: false, user: null });
      }
    };

    checkAuth();
  }, []);

  if (authStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-400"></div>
          <div className="mt-4 text-indigo-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
