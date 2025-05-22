import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMethod, setAuthMethod] = useState(null);
  const [user, setUser] = useState(null);

  // Check for token and user data on app load
  useEffect(() => {
    const storedAuthMethod = localStorage.getItem("authMethod");
    const token = storedAuthMethod === "oauth" 
      ? localStorage.getItem("accessToken")
      : localStorage.getItem("authToken");

    if (token) {
      setIsLoggedIn(true);
      setAuthMethod(storedAuthMethod);
      
      // Set user data
      const name = localStorage.getItem("userName");
      const avatar = localStorage.getItem("userAvatar");
      if (name || avatar) {
        setUser({ name, avatar });
      }
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    const storedAuthMethod = localStorage.getItem("authMethod");
    setAuthMethod(storedAuthMethod);
    
    // Update user data
    const name = localStorage.getItem("userName");
    const avatar = localStorage.getItem("userAvatar");
    if (name || avatar) {
      setUser({ name, avatar });
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("userName");
    localStorage.removeItem("authMethod");
    localStorage.removeItem("oauth_state");
    
    setIsLoggedIn(false);
    setAuthMethod(null);
    setUser(null);
    window.location.reload();
  };

  // Function to refresh OAuth token
  const refreshOAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch("http://localhost:3000/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: "YOUR_CLIENT_ID", // Replace with your client ID
          client_secret: "YOUR_CLIENT_SECRET", // Replace with your client secret
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      throw error;
    }
  };

  // Function to get the current auth token
  const getAuthToken = () => {
    if (authMethod === "oauth") {
      return localStorage.getItem("accessToken");
    }
    return localStorage.getItem("authToken");
  };

  // Function to reset the database
  const resetDatabase = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to reset the database?"
    );
    if (confirmation) {
      try {
        const response = await fetch("http://localhost:3000/seed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          alert("Database reset successfully!");
          window.location.reload();
        } else {
          alert("Failed to reset the database.");
        }
      } catch (error) {
        console.error("Error resetting the database:", error);
        alert("An error occurred while resetting the database.");
      }
    }
  };

  // Add event listener for the 's' key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.key === "s" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        resetDatabase();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        login, 
        logout, 
        authMethod,
        getAuthToken,
        refreshOAuthToken,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
