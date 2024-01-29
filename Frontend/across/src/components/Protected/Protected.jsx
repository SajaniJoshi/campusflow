import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Protected({ children }) {
  const [auth] = useAuth();

  if (!auth.token) {
    return <Navigate to="/campus-flow/login" />;
  } else {
    return children;
  }
}

export default Protected;
