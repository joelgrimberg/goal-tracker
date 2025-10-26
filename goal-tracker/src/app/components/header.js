"use client";

import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  UserCircleIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    setIsClient(true);

    // Make window.print stubbable for tests by creating it as an own property
    // Store the native print function
    const nativePrint = window.print.bind(window);
    // Create print as an own property that can be stubbed
    Object.defineProperty(window, 'print', {
      value: nativePrint,
      writable: true,
      configurable: true
    });

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <header
      className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white"
      role="banner"
    >
      <div className="text-lg font-bold">
        <Link href="/" aria-label="Go to Goal Tracker home page" data-testid="header-logo">
          Goal Tracker
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isClient && user?.avatar && user.avatar !== 'null' && (
          <img
            src={user.avatar.startsWith('/uploads/') ? `http://localhost:3000${user.avatar}` : user.avatar}
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
          onClick={handlePrint}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Print page"
          data-testid="print-button"
          title="Print page (Ctrl/Cmd + P)"
        >
          <PrinterIcon className="h-6 w-6" />
        </button>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label={menuVisible ? "Close menu" : "Open menu"}
          data-testid="menu-button"
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
                data-testid="menu-home"
              >
                [h]ome
              </Link>
            </li>
            {!isLoggedIn && (
              <li
                className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
                role="menuitem"
              >
                <UserCircleIcon className="h-5 w-5" />
                <Link href="/login" aria-label="Go to login page" data-testid="menu-login">
                  [l]ogin
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li
                className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
                role="menuitem"
              >
                <UserCircleIcon className="h-5 w-5" />
                <Link
                  href="/profile"
                  aria-label="Go to profile settings"
                  data-testid="menu-profile"
                >
                  [p]rofile
                </Link>
              </li>
            )}
            <li
              className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
              role="menuitem"
            >
              <InformationCircleIcon className="h-5 w-5" />
              <a href="/about" aria-label="Go to about page" data-testid="menu-about">
                [a]bout
              </a>
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
              role="menuitem"
            >
              <Link href="/form/create" aria-label="Create a new goal" data-testid="menu-create-goal">
                [c]reate goal
              </Link>
            </li>
            {isLoggedIn && (
              <li
                className="px-4 py-2 hover:bg-gray-600"
                role="menuitem"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left"
                  data-testid="menu-logout"
                >
                  [l]ogout
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
