import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar borderColor="#439a86" />
      <div className="mainlayout__contents">
        <Sidebar />
        <main className="mainlayout__content">{children}</main>
      </div>
      <div className="mainlayout__footer">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
