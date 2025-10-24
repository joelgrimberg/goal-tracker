"use client";
import useSWR from "swr";
import { useState, useEffect, useCallback } from "react";
import Todos from "./components/todos";
import { useAuth } from "./context/AuthContext"; // Import the useAuth hook
import { useSearchParams } from "next/navigation";

const fetcher = (url) => fetch(url).then((r) => r.json());
const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [notification, setNotification] = useState(null);
  const searchParams = useSearchParams();
  
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

  // Set global constant - runs on mount
  useEffect(() => {
    window.training = 'cypress';
    console.log('Set window.training to:', window.training);
  }, []);

  // Check for success notification from URL params
  useEffect(() => {
    const success = searchParams.get('success');
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    
    if (success === 'true' && title) {
      setNotification({
        title: decodeURIComponent(title),
        description: description ? decodeURIComponent(description) : ''
      });
      
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Calculate pagination
  const isDataValid = data && Array.isArray(data);
  const totalPages = isDataValid ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGoals = isDataValid ? data.slice(startIndex, endIndex) : [];

  const handleDelete = useCallback(() => {
    if (selectedRow === -1 || !data || !currentGoals[selectedRow]) return;
    
    const goalId = currentGoals[selectedRow].id;
    window.location.href = `/goal/delete?id=${goalId}`;
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

      if (event.key === "c") {
        window.location.href = "/form/create"; // Navigate to create goal page
      } else if (event.key === "l") {
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
  if (data && !Array.isArray(data)) {
    return (
      <div data-cy="dataFormatError" className="pt-16 p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md mx-auto">
          <h2 className="font-bold text-lg mb-2">Data Format Error</h2>
          <p>The server returned data in an unexpected format. Expected an array of goals, but received:</p>
          <pre className="mt-2 text-sm bg-red-50 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Success Notification */}
      {notification && (
        <div 
          className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 max-w-md"
          role="alert"
          data-testid="success-notification"
        >
          <div className="flex justify-between items-start">
            <div>
              <strong className="font-bold">Goal Added!</strong>
              <p className="mt-1"><strong>Title:</strong> {notification.title}</p>
              {notification.description && (
                <p className="mt-1"><strong>Description:</strong> {notification.description}</p>
              )}
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-green-700 hover:text-green-900"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
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
            <tbody id="goals-rows" data-testid="goals" onMouseLeave={() => clearState()}>
              {currentGoals.length > 0 ? (
                currentGoals.map((goal, index) => (
                  <tr
                    key={goal.id}
                    role="row"
                    className={selectedRow === index ? "highlight" : ""}
                    onMouseEnter={() => handleRowHover(index)}
                    aria-selected={selectedRow === index}
                  >
                    <td role="gridcell" className="break-word fixed-width-600">
                      <a
                        href={`/goal/${goal.id}`}
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-8">
                    No goals found
                  </td>
                </tr>
              )}
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
