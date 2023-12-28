import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="mainlayout__content">
        <Sidebar />
        <main>{children}</main>
      </div>
      <div className="mainlayout__footer">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
