"use client";

import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null); // State for user info
  const [isClient, setIsClient] = useState(false); // State to check if rendering on the client
  const router = useRouter();

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    // Ensure this runs only on the client
    setIsClient(true);

    // Fetch user data from localStorage
    const name = localStorage.getItem("userName");
    const avatar = localStorage.getItem("userAvatar");
    if (name || avatar) {
      setUser({ name, avatar });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT" ||
        activeElement.isContentEditable
      ) {
        return;
      }

      if (event.key === "=" || event.key === "+") {
        toggleMenu();
      }

      if (event.key === "a") {
        router.push("/about");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <header
      className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white"
      role="banner"
    >
      <div className="text-lg font-bold">
        <Link href="/" aria-label="Go to Goal Tracker home page">
          Goal Tracker
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Ensure this only renders on the client */}
        {isClient && user?.avatar && (
          <img
            src={`http://localhost:3000${user.avatar}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        )}
        {isClient && user?.name && (
          <span
            className="text-sm font-medium"
            aria-label={`Logged in as ${user.name}`}
          >
            {user.name}
          </span>
        )}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label={menuVisible ? "Close menu" : "Open menu"}
          aria-expanded={menuVisible}
        >
          {menuVisible ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      {menuVisible && (
        <nav
          className="absolute top-12 right-4 bg-gray-700 text-white rounded-md shadow-lg"
          role="navigation"
          aria-label="Main menu"
        >
          <ul className="flex flex-col">
            <li
              className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
              role="menuitem"
            >
              <HomeIcon className="h-5 w-5" />
              <Link
                href={{
                  pathname: "/",
                  query: { name: "home" },
                }}
                aria-label="Go to home page"
              >
                [h]ome
              </Link>
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
              role="menuitem"
            >
              <InformationCircleIcon className="h-5 w-5" />
              <a href="/about" aria-label="Go to about page">
                [a]bout
              </a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-600" role="menuitem">
              <a href="/contact" aria-label="Go to contact page">
                [c]ontact
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
