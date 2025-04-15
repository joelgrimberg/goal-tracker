const express = require("express");
const { register, login, getUserFromToken } = require("../utils/auth");
const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await register(email, password, name);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("Login route hit");

  try {
    const { email, password } = req.body;
    console.log(email);
    const { user, token } = await login(email, password);

    // Set cookie for client
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token =
      req.cookies.auth_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
