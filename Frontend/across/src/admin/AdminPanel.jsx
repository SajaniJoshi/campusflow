import React from "react";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Home";
import FileUpload from "./FileUpload";
import Converter from "./Converter";
import ShowSimilarityTable from "./ShowSimilarityTable";
import ModulesList from "./ModulesList";
import UserList from "./UserList";
import PdfToRdf from "./PdfToRDF";
import TransferCredits from "./TransferCredits";
import CompareModules from "./CompareModules";
import UsersofTransferCredits from "./UsersofTransferCredits";
import { useAuth } from "../context/AuthContext";
import GenerateRDF from "./GenerateRDF";

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
        <Route path="pdfToRdf" element={<PdfToRdf />} />
        <Route path="modulelist" element={<ModulesList />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="transferCredits" element={<TransferCredits />} />
        <Route path="users/transferCreditRequests" element={<UsersofTransferCredits />} />
        <Route path="comparemodules" element={<CompareModules />} />
        <Route path="generateRDF" element={<GenerateRDF />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
