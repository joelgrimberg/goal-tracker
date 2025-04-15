import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Check for token in localStorage
    setIsLoggedIn(!!token); // Set login state based on token presence
  }, []);

  const login = () => setIsLoggedIn(true); // Set login state to true
  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    setIsLoggedIn(false); // Set login state to false
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
