import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Check for token in localStorage
    setIsLoggedIn(!!token); // Set login state based on token presence
  }, []);

  const login = () => {
    setIsLoggedIn(true); // Set login state to true
    window.location.href = "/";
  };
  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    localStorage.removeItem("userAvatar"); // Remove token from localStorage
    localStorage.removeItem("userName"); // Remove token from localStorage
    setIsLoggedIn(false); // Set login state to false
    window.location.reload(); // Refresh the page
  };

  // Function to reset the database
  const resetDatabase = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to reset the database?",
    );
    if (confirmation) {
      try {
        const response = await fetch("http://localhost:3000/seed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials if your backend requires them
        });

        if (response.ok) {
          alert("Database reset successfully!");
          window.location.reload(); // Refresh the page
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
      // Check if the 's' key is pressed and no input field is active
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
