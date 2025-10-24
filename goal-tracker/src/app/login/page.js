"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const initialState = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const formRef = useRef(null);
  const emailInputRef = useRef(null); // Create a ref for the email input
  const router = useRouter();
  const { login } = useAuth(); // Access the login function from AuthContext

  const [formData, setFormData] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [authMethod, setAuthMethod] = useState("jwt"); // Default to JWT

  // Add event listener for Escape key and Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        router.push("/"); // Navigate back to the home page
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        // Ctrl+Enter or Cmd+Enter (for Mac)
        e.preventDefault();
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  // Automatically focus the email input on page load
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (authMethod === "oauth") {
      // Redirect to OAuth authorization endpoint
      const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
      console.log('Environment variables:', {
        NEXT_PUBLIC_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
        NEXT_PUBLIC_OAUTH_REDIRECT_URI: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI
      });
      const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || "http://localhost:3001/oauth");
      const scope = encodeURIComponent("read write");
      const state = Math.random().toString(36).substring(7); // Generate random state
      
      // Store state in localStorage for verification
      localStorage.setItem("oauth_state", state);
      console.log('Stored OAuth state:', state);
      
      // Only include public parameters in the authorization URL
      const authUrl = `http://localhost:3000/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
      console.log('Redirecting to:', authUrl);
      
      // Redirect to OAuth authorization endpoint
      window.location.href = authUrl;
      return;
    }

    try {
      console.log("Logging in with:", formData);

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;

      console.log("Login response data:", data);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", formData.email);
      if (data.avatar) {
        localStorage.setItem("userAvatar", data.avatar);
      }
      localStorage.setItem("authMethod", "jwt"); // Store the auth method

      login();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      role="main"
      aria-labelledby="login-heading"
    >
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1
            id="login-heading"
            className="text-2xl font-bold text-gray-900"
            tabIndex={-1}
          >
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
              aria-label="Create a new account"
            >
              create a new account
            </a>
          </p>
        </div>

        {/* Authentication Method Selector */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod("jwt")}
            className={`px-4 py-2 rounded-md ${
              authMethod === "jwt"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("oauth")}
            className={`px-4 py-2 rounded-md ${
              authMethod === "oauth"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            OAuth 2.0
          </button>
        </div>

        {authMethod === "jwt" ? (
          <form
            onSubmit={handleSubmit}
            ref={formRef}
            className="mt-8 space-y-6"
            aria-describedby="error-message"
          >
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  ref={emailInputRef} // Attach the ref to the email input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="relative block w-full rounded-t-md border-0 p-2 text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:text-black"
                  placeholder="Email address"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="relative block w-full rounded-t-md border-0 p-2 text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:text-black"
                  placeholder="Password"
                  aria-required="true"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  aria-describedby="remember-me-label"
                />
                <label
                  id="remember-me-label"
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  aria-label="Forgot your password?"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                aria-label="Sign in to your account"
              >
                Sign in
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Click the button below to sign in with OAuth 2.0
            </p>
            <button
              onClick={handleSubmit}
              className="w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Continue with OAuth 2.0
            </button>
          </div>
        )}

        {errorMessage && (
          <p
            id="error-message"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
