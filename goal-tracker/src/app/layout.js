"use client";
// import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Header from "./components/header.js";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function RootLayout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const videoRef = useRef(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Set global constant
  useEffect(() => {
    window.training = 'cypress';
    console.log(window.training)
  }, []);

  useEffect(() => {
    const toggleVideo = () => {
      if (videoRef.current) {
        if (isVideoPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsVideoPlaying(!isVideoPlaying);
      }
    };

    // Ensure this runs only on the client
    setIsClient(true);

    const handleKeyDown = (event) => {
      if (event.key === "v") {
        toggleVideo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVideoPlaying]);

  return (
    <html lang="en">
      <body
        data-cy="app"
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the entire app with AuthProvider */}
        <AuthProvider>
          {/* Background video rendered only on the client */}
          {isClient && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              id="background-video"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: "-2",
              }}
            >
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(3px)",
              zIndex: "-1",
            }}
          />

          {/* Header and children */}
          <Header menuVisible={menuVisible} toggleMenu={toggleMenu} />
          <Image
            id="background"
            src="/background.svg"
            width="100"
            height="100"
            alt=""
            fetchPriority="high"
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
