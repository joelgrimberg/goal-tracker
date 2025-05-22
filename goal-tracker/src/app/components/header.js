"use client";

import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { isLoggedIn, logout, user } = useAuth();

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    setIsClient(true);
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

      if (event.key === "h") {
        router.push("/");
      }

      if (event.key === "a") {
        router.push("/about");
      }

      if (event.key === "p") {
        router.push("/profile");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
        {isClient && user?.avatar && (
          <img
            src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000${user.avatar}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
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
            {isLoggedIn ? (
              <>
                <li
                  className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
                  role="menuitem"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <Link
                    href="/profile"
                    aria-label="Go to profile settings"
                  >
                    [p]rofile
                  </Link>
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-600"
                  role="menuitem"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left"
                  >
                    [l]ogout
                  </button>
                </li>
              </>
            ) : (
              <li
                className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
                role="menuitem"
              >
                <UserCircleIcon className="h-5 w-5" />
                <Link
                  href="/login"
                  aria-label="Go to login page"
                >
                  [l]ogin
                </Link>
              </li>
            )}
            <li
              className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
              role="menuitem"
            >
              <InformationCircleIcon className="h-5 w-5" />
              <a href="/about" aria-label="Go to about page">
                [a]bout
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
