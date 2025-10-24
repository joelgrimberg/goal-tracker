"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DeleteGoalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID parameter is missing");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/goal/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch goal");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        router.push("/");
      } else if (e.key === "y") {
        handleDelete();
      } else if (e.key === "n") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, id]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`http://localhost:3000/goal/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        console.log(`Deleted goal with id: ${id}`);
        router.push("/?deleted=true");
      } else {
        console.error("Failed to delete the goal");
        setError("Failed to delete the goal");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting the goal:", error);
      setError("An error occurred while deleting the goal");
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-8">No data found</div>;
  }

  return (
    <div>
      <main className="pt-16" role="main">
        <section className="p-8">
          <h1 className="text-2xl font-bold mb-6">Delete Goal?</h1>
          
          <div className="mb-6">
            <p className="mb-4">Are you sure you want to delete this goal?</p>
            
            <table className="table-width w-full mb-6">
              <tbody>
                <tr>
                  <td className="font-semibold">Title</td>
                  <td>{data.title}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Description</td>
                  <td>{data.description || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Status</td>
                  <td>{data.status}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Target Date</td>
                  <td>{data.targetDate ? new Date(data.targetDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="border border-red-500 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              data-testid="confirm-delete"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="border border-gray-300 px-6 py-2 rounded hover:text-white disabled:opacity-50"
              data-testid="cancel-delete"
            >
              No, Cancel
            </button>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              <kbd>y</kbd> Yes, delete <br />
              <kbd>n</kbd> / <kbd>Esc</kbd> No, cancel
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}



