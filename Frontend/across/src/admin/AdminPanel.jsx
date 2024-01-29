import React from "react";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Home";
import FileUpload from "./FileUpload";
import Converter from "./Converter";
import ShowSimilarityTable from "./ShowSimilarityTable";
import ModulesList from "./ModulesList";
import TransferCredits from "./TransferCredits";
import UsersofTransferCredits from "./UsersofTransferCredits";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const [auth, setAuth] = useAuth();

  // Check if the user role is not ADMIN
  if (auth.user.role !== 'ADMIN') {
    // Redirect to another component (e.g., a login page)
    return <Navigate to="/campus-flow/login" />;
  }
  return (
    <div>
      <Outlet />

      {/* Nested Routes */}
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="upload" element={<FileUpload />} />
        <Route path="automation" element={<Converter />} />
        <Route path="similaritytable" element={<ShowSimilarityTable />} />
        <Route path="modulelist" element={<ModulesList />} />
        <Route path="transferCredits" element={<TransferCredits />} />
        <Route path="users/transferCreditRequests" element={<UsersofTransferCredits />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
