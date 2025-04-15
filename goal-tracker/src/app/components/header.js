import Link from "next/link";
import React from "react";
import {
  UserIcon,
  HomeIcon,
  ClipboardIcon,
  CogIcon,
} from "@heroicons/react/24/solid"; // Import relevant icons from Heroicons
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Header = ({ menuVisible, toggleMenu }) => {
  const { isLoggedIn, logout } = useAuth(); // Access login state and logout function from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function to clear the token and update state
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-20">
        <div className="flex space-x-6">
          <Link
            href="/"
            className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
          >
            <HomeIcon className="h-5 w-5 mr-2" /> {/* Home icon for Goals */}
            Goals
          </Link>
          <Link
            href="/tasks"
            className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
          >
            <ClipboardIcon className="h-5 w-5 mr-2" />{" "}
            {/* Clipboard icon for Tasks */}
            Tasks
          </Link>
          <Link
            href="/profile"
            className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
          >
            <UserIcon className="h-5 w-5 mr-2" /> {/* User icon for Profile */}
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
          >
            <CogIcon className="h-5 w-5 mr-2" /> {/* Cog icon for Settings */}
            Settings
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-blue-500 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-gray-700"></div>
              <div className="w-6 h-0.5 bg-gray-700"></div>
            </div>
          </button>
          {isLoggedIn ? (
            <Link
              href="/"
              onClick={handleLogout} // Call handleLogout when the user clicks Logout
              className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
            >
              <UserIcon className="h-5 w-5 mr-2" /> {/* User icon for Logout */}
              Logout
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
            >
              <UserIcon className="h-5 w-5 mr-2" /> {/* User icon for Login */}
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
