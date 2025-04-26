"use client";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Todos from "./components/todos";
import { useAuth } from "./context/AuthContext"; // Import the useAuth hook

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/feed/goals",
    fetcher,
  );
  const [selectedRow, setSelectedRow] = useState(-1);
  const [hoverText, setHoverText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { isLoggedIn, logout } = useAuth(); // Access login state and logout function from AuthContext

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
          location.reload();
        } else {
          console.error("Failed to delete the goal");
        }
      } catch (error) {
        console.error("Error deleting the goal:", error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore keypress if an input, textarea, select, or content-editable element is focused
      const activeElement = document.activeElement;
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT" ||
        activeElement.isContentEditable
      ) {
        return;
      }

      if (!data) return;

      if (event.key === "l") {
        if (isLoggedIn) {
          logout(); // Log the user out
        } else {
          window.location.href = "http://localhost:3001/login"; // Redirect to login page
        }
      } else if (
        (event.key === "Enter" || event.key === "e") &&
        selectedRow !== -1
      ) {
        window.location.href =
          "http://localhost:3001/goal/edit?id=" + data[selectedRow].id;
      } else if (event.key === "ArrowDown" || event.key === "j") {
        setSelectedRow((prev) => (prev < data.length - 1 ? prev + 1 : 0));
        setHoverText("");
      } else if (event.key === "ArrowUp" || event.key === "k") {
        if (selectedRow === -1) {
          setSelectedRow(data.length - 1);
        } else {
          setSelectedRow((prev) => (prev > 0 ? prev - 1 : data.length - 1));
        }
        setHoverText("");
      } else if (event.key === "i" && selectedRow !== -1) {
        setHoverText((prev) => (prev ? "" : data[selectedRow].description));
      }
      if (event.key === "m") {
        setShowModal(true);
      } else if (event.key === "Escape") {
        setSelectedRow(-1);
        setHoverText("");
        setShowModal(false);
      } else if (event.key === "t" && selectedRow !== -1) {
        handleDelete(selectedRow);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedRow, isLoggedIn, logout, handleDelete]);

  const handleRowHover = (index) => {
    setSelectedRow(index);
  };

  const clearState = () => {
    setHoverText("");
    setSelectedRow(-1);
  };

  if (isLoading) return <div data-cy="loading">Loading...</div>;
  if (error) return <div data-cy="fetchError">Error: {error.message}</div>;

  return (
    <div>
      {/* Main Content */}
      <main className="pt-16" role="main" aria-labelledby="goals-heading">
        <section id="hero">
          <h1 id="goals-heading" className="sr-only">
            Goals Table
          </h1>
          <table
            className="table-width"
            role="grid"
            aria-label="Goals Table"
            aria-describedby="keyboard-shortcuts"
          >
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Target Date</th>
                <th scope="col">Days Left</th>
              </tr>
            </thead>
            <tbody onMouseLeave={() => clearState()}>
              {data.map((goal, index) => (
                <tr
                  key={goal.id}
                  role="row"
                  className={selectedRow === index ? "highlight" : ""}
                  onMouseEnter={() => handleRowHover(index)}
                  aria-selected={selectedRow === index}
                >
                  <td role="gridcell" className="break-word fixed-width-600">
                    <a
                      href={`http://localhost:3000/goal/${goal.id}`}
                      data-cy={`goal-link-${goal.id}`}
                      className="goal-link"
                      aria-label={`View details for goal: ${goal.title}`}
                    >
                      {goal.title}
                    </a>
                  </td>

                  <td role="gridcell" className="break-word">
                    {goal.targetDate.split("T")[0]}
                  </td>
                  <td role="gridcell">
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
                <td className="info-box" colSpan="4" id="keyboard-shortcuts">
                  <p>
                    <kbd>j</kbd>/<kbd>↓</kbd> down <br />
                    <kbd>k</kbd>/<kbd>↑</kbd> up <br />
                    <kbd>i</kbd> info <br />
                    <kbd>e</kbd> edit <br />
                    <kbd>t</kbd> trash <br />
                    <kbd>l</kbd> login/logout <br />
                    <kbd>esc</kbd> cancel <br />
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
          {hoverText && (
            <div
              className="hover-text show-hover-text"
              role="tooltip"
              aria-live="polite"
            >
              {hoverText}
            </div>
          )}
        </section>
      </main>

      {/* Todos Component */}
      <Todos />

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-labelledby="modal-header"
          aria-describedby="modal-body"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 id="modal-header">Header</h3>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-body" id="modal-body">
              <p>Hi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
