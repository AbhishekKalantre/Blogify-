import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BlogsList from "./pages/Blogs/BlogsList";
import NewsList from "./pages/Blogs/NewsList";
import StoriesList from "./pages/Blogs/StoriesList";
import CreatePost from "./pages/Blogs/CreatePost";
import EditPost from "./pages/Blogs/EditPost";
import ViewPost from "./pages/Blogs/ViewPost";
import TagsManager from "./pages/Tags/TagsManager";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="blogs" element={<BlogsList />} />
        <Route path="news" element={<NewsList />} />
        <Route path="stories" element={<StoriesList />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="edit-post/:id" element={<EditPost />} />
        <Route path="view-post/:id" element={<ViewPost />} />
        <Route path="tags" element={<TagsManager />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;
