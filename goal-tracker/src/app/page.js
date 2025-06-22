"use client";
import useSWR from "swr";
import { useState, useEffect, useCallback } from "react";
import Todos from "./components/todos";
import { useAuth } from "./context/AuthContext"; // Import the useAuth hook

const fetcher = (url) => fetch(url).then((r) => r.json());
const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
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

  // Calculate pagination
  const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGoals = data ? data.slice(startIndex, endIndex) : [];

  const handleDelete = useCallback(async () => {
    if (selectedRow === -1 || !data || !currentGoals[selectedRow]) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?",
    );
    if (confirmed) {
      const goalId = currentGoals[selectedRow].id;
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
  }, [selectedRow, data, currentGoals]);

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

      if (!data || data.length === 0) return;

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
          "http://localhost:3001/goal/edit?id=" + currentGoals[selectedRow].id;
      } else if (event.key === "ArrowDown" || event.key === "j") {
        setSelectedRow((prev) => {
          if (prev === -1) {
            return 0;
          }
          const newRow = prev < currentGoals.length - 1 ? prev + 1 : 0;
          // If we're at the end of the current page and there's a next page, go to it
          if (newRow === 0 && currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
          }
          return newRow;
        });
        setHoverText("");
      } else if (event.key === "ArrowUp" || event.key === "k") {
        setSelectedRow((prev) => {
          if (prev === -1) {
            return currentGoals.length - 1;
          }
          const newRow = prev > 0 ? prev - 1 : currentGoals.length - 1;
          // If we're at the start of the current page and there's a previous page, go to it
          if (newRow === currentGoals.length - 1 && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
          }
          return newRow;
        });
        setHoverText("");
      } else if (event.key === "ArrowRight" && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
        setSelectedRow(0);
      } else if (event.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
        setSelectedRow(0);
      } else if (event.key === "i" && selectedRow !== -1) {
        setHoverText((prev) => (prev ? "" : currentGoals[selectedRow].description));
      } else if (event.key === "m") {
        setShowModal(true);
      } else if (event.key === "Escape") {
        setSelectedRow(-1);
        setHoverText("");
        setShowModal(false);
      } else if (event.key === "t" && selectedRow !== -1) {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedRow, isLoggedIn, logout, handleDelete, currentPage, currentGoals, totalPages]);

  // Reset selectedRow when currentGoals changes (pagination)
  useEffect(() => {
    if (selectedRow >= currentGoals.length) {
      setSelectedRow(currentGoals.length > 0 ? 0 : -1);
    }
  }, [currentGoals, selectedRow]);

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
              {currentGoals.map((goal, index) => (
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
                    <kbd>←</kbd>/<kbd>→</kbd> previous/next page <br />
                    <kbd>i</kbd> info <br />
                    <kbd>e</kbd> edit <br />
                    <kbd>t</kbd> trash <br />
                    <kbd>l</kbd> login/logout <br />
                    <kbd>esc</kbd> cancel <br />
                  </p>
                  <p className="mt-2">
                    Page {currentPage + 1} of {totalPages}
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
