import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./routes";

const DashboardMain = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default DashboardMain;
