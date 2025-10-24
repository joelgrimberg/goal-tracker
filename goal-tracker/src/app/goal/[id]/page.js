"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

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
          <h1 className="text-2xl font-bold mb-6">Goal Details</h1>
          
          <table className="table-width w-full">
            <thead>
              <tr>
                <th scope="col" className="text-left">Field</th>
                <th scope="col" className="text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">ID</td>
                <td>{data.id}</td>
              </tr>
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
              <tr>
                <td className="font-semibold">Created At</td>
                <td>{data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}</td>
              </tr>
              {data.tasks && data.tasks.length > 0 && (
                <tr>
                  <td className="font-semibold">Tasks</td>
                  <td>
                    <ul className="list-disc list-inside">
                      {data.tasks.map((task) => (
                        <li key={task.id}>
                          {task.title} - {task.status}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="info-box pt-4">
                  <p><kbd>esc</kbd> back to home</p>
                </td>
              </tr>
            </tfoot>
          </table>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => router.push("/")}
              className="border border-gray-300 px-4 py-2 rounded hover:text-white"
              data-testid="back-button"
            >
              Back to Goals
            </button>
            <button
              onClick={() => router.push(`/goal/edit?id=${id}`)}
              className="border border-gray-300 px-4 py-2 rounded hover:text-white"
              data-testid="edit-button"
            >
              Edit Goal
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

