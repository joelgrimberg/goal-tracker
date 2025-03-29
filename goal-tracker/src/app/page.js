"use client";
import useSWR from "swr";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Todos from "./components/todos";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/feed/goals",
    fetcher,
  );
  const [selectedRow, setSelectedRow] = useState(-1);
  const [hoverText, setHoverText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?",
    );
    if (confirmed) {
      const goalId = data[selectedRow].id;
      try {
        const response = await fetch(`http://localhost:3000/goal/${goalId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          console.log(`Deleted goal with id: ${goalId}`);
          // Optionally, you can update the state to remove the deleted goal from the UI
          location.reload();
        } else {
          console.error("Failed to delete the goal");
        }
      } catch (error) {
        console.error("Error deleting the goal:", error);
      }
    }
  };

  // Toggle video playback
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!data) return;

      if ((event.key === "Enter" || event.key === "e") && selectedRow !== -1) {
        window.location.href =
          "http://localhost:3001/goal/edit?id=" + data[selectedRow].id;
      } else if (event.key === "ArrowDown" || event.key === "j") {
        setSelectedRow((prev) => (prev < data.length - 1 ? prev + 1 : 0));
        setHoverText(""); // Clear the hover text
      } else if (event.key === "ArrowUp" || event.key === "k") {
        if (selectedRow === -1) {
          setSelectedRow(data.length - 1); // Select the last row if no row is selected
        } else {
          setSelectedRow((prev) => (prev > 0 ? prev - 1 : data.length - 1));
        }
        setHoverText(""); // Clear the hover text
      } else if (event.key === "i" && selectedRow !== -1) {
        setHoverText((prev) => (prev ? "" : data[selectedRow].description));
      }
      if (event.key === "m") {
        setShowModal(true);
      } else if (event.key === "Escape") {
        setSelectedRow(-1);
        setHoverText("");
        setShowModal(false); // Also close the modal on Escape
      } else if (event.key === "t" && selectedRow !== -1) {
        handleDelete(selectedRow);
      } else if (event.key === "v") {
        toggleVideo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedRow, isVideoPlaying]);

  const handleRowHover = (index) => {
    setSelectedRow(index);
    // setHoverText(data[index].description);
  };

  const clearState = () => {
    setHoverText("");
    setSelectedRow(-1);
  };

  if (isLoading) return <div data-cy="loading">Loading...</div>;
  if (error) return <div data-cy="fetchError">Error: {error.message}</div>;

  return (
    <div>
      {/* Background video with better blending */}
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
          zIndex: "-2", // Behind overlay
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video status indicator */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "3px",
          fontSize: "12px",
          opacity: 0.7,
          zIndex: 1,
        }}
      >
        Video: {isVideoPlaying ? "Playing" : "Paused"} (Press 'v' to toggle)
      </div>

      {/* Overlay to blend video with background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.85)", // Darker overlay for more subtle video
          backdropFilter: "blur(3px)", // Add blur effect
          zIndex: "-1",
        }}
      />

      <main>
        <img
          id="background"
          src="/background.svg"
          alt=""
          fetchPriority="high"
        />
        <section id="hero">
          <table className="table-width">
            <thead>
              <tr>
                <th>
                  <p>Title</p>
                </th>
                <th>Status</th>
                <th>Target Date</th>
                <th>Days Left</th>
              </tr>
            </thead>
            <tbody onMouseLeave={() => clearState()}>
              {data.map((goal, index) => (
                <tr
                  key={goal.id}
                  className={selectedRow === index ? "highlight" : ""}
                  onMouseEnter={() => handleRowHover(index)}
                >
                  <td className="break-word fixed-width-600">
                    <a
                      href={`http://localhost:3000/goal/${goal.id}`}
                      data-cy={`goal-link-${goal.id}`}
                      className="goal-link"
                    >
                      {goal.title}
                    </a>
                  </td>
                  <td className="break-word">{goal.status}</td>
                  <td className="break-word">
                    {goal.targetDate.split("T")[0]}
                  </td>
                  <td>
                    {Math.floor(
                      (new Date(goal.targetDate) - Date.now()) /
                        (1000 * 60 * 60 * 24),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="info-box">
                  <p>
                    <kbd>j</kbd>/<kbd>↓</kbd> down <br />
                    <kbd>k</kbd>/<kbd>↑</kbd> up
                    <br />
                  </p>
                </td>
                <td className="info-box">
                  <p>
                    <kbd>i</kbd> info [todo]
                    <br />
                    <kbd>e</kbd> edit [todo] <br />
                    <kbd>t</kbd> trash
                    <br />
                  </p>
                </td>
                <td className="info-box">
                  <p>
                    <kbd>a</kbd> add goal [doing]
                    <br />
                    <kbd>s</kbd> add subgoal [todo]
                    <br />
                  </p>
                </td>

                <td className="info-box">
                  <p>
                    <kbd>enter</kbd> select [todo] <br />
                    <kbd>esc</kbd> cancel <br />
                    <kbd>g</kbd> toggle Goals <br />
                    <kbd>v</kbd> toggle video <br />
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
          {hoverText && (
            <div className="hover-text show-hover-text">{hoverText}</div>
          )}
        </section>
      </main>
      <Todos />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3></h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Hi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
