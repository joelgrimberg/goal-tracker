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
  const [notificationSource, setNotificationSource] = useState(null); // 'form' or 'api'
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchParams = useSearchParams();
  
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    setCurrentPage(0); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(0);
    setIsSearching(false);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsSearching(searchInput.length > 0);
    }, 800); // Wait 800ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build API URL with search parameter
  const apiUrl = searchQuery 
    ? `http://localhost:3000/feed/goals?searchString=${encodeURIComponent(searchQuery)}`
    : "http://localhost:3000/feed/goals";
    
  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
    revalidateOnFocus: true, // Revalidate when window regains focus
    revalidateOnReconnect: true, // Revalidate when network reconnects
  });

  const [previousData, setPreviousData] = useState(null);

  // Detect new goals added via API and show notification
  useEffect(() => {
    if (data && previousData && Array.isArray(data) && Array.isArray(previousData)) {
      const newGoals = data.filter(goal => 
        !previousData.some(prevGoal => prevGoal.id === goal.id)
      );
      
      if (newGoals.length > 0) {
        const latestGoal = newGoals[newGoals.length - 1]; // Get the most recent one
        setNotification({
          title: latestGoal.title,
          description: latestGoal.description
        });
        setNotificationSource('api');
        
        // Auto-hide notification after 5 seconds
        const timer = setTimeout(() => {
          setNotification(null);
          setNotificationSource(null);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
    
    // Update previous data
    if (data) {
      setPreviousData(data);
    }
  }, [data, previousData]);

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
    
    console.log('URL params:', { success, title, description });
    
    if (success === 'true' && title) {
      console.log('Setting notification from URL params');
      setNotification({
        title: decodeURIComponent(title),
        description: description ? decodeURIComponent(description) : ''
      });
      setNotificationSource('form');
      
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
        setNotificationSource(null);
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
              <strong className="font-bold">
                {notificationSource === 'form' ? 'Goal Added!' : 'New Goal Detected!'}
              </strong>
              <p className="mt-1"><strong>Title:</strong> {notification.title}</p>
              {notification.description && (
                <p className="mt-1"><strong>Description:</strong> {notification.description}</p>
              )}
              {notificationSource === 'api' && (
                <p className="mt-1 text-sm text-blue-600">
                  Added via API
                </p>
              )}
            </div>
            <button 
              onClick={() => {
                setNotification(null);
                setNotificationSource(null);
              }}
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
          
          {/* Search Bar */}
          <div className="mb-6 px-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="search-input"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    data-testid="clear-search"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              {isSearching && (
                <p className="text-sm text-gray-600 mt-2">
                  Searching for: "{searchInput}"
                </p>
              )}
            </div>
          </div>
          <table
            className="table-width"
            role="grid"
            aria-label="Goals Table"
          >
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Target Date</th>
                <th scope="col">Days Left</th>
              </tr>
            </thead>
            <tbody id="goals-rows" data-testid="goals">
              {currentGoals.length > 0 ? (
                currentGoals.map((goal, index) => (
                  <tr
                    key={goal.id}
                    role="row"
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
                    {isSearching ? `No goals found matching "${searchInput}"` : "No goals found"}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="info-box" colSpan="3">
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p>
                        Page {currentPage + 1} of {totalPages}
                        {isSearching && (
                          <span className="ml-2 text-blue-600">
                            (Search: "{searchInput}")
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        data-testid="prev-page-button"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        data-testid="next-page-button"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </main>

      {/* Todos Component */}
      <Todos />

    </div>
  );
}
