import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import Stories from "./pages/Stories";
import News from "./pages/News";
import PostDetail from "./pages/PostDetail";
import PostDetailWrapper from "./components/PostDetail/PostDetailWrapper";
import DashboardMain from "./dashboard/DashboardMain";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/news" element={<News />} />

        {/* Legacy route - keep for backward compatibility but use wrapper for better error handling */}
        <Route
          path="/post/:id"
          element={
            <PostDetailWrapper>
              <PostDetail />
            </PostDetailWrapper>
          }
        />

        {/* New post detail routes with type parameter */}
        <Route
          path="/:type/:id"
          element={
            <PostDetailWrapper>
              <PostDetail />
            </PostDetailWrapper>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardMain />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
