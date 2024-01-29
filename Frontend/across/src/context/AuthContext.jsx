import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      return JSON.parse(data);
    } else {
      return { user: null, token: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = function () {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };
