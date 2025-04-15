"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { updateGoal } from "./actions";
const initialState = {
  message: "",
};

export default function GoalDetails() {
  const formRef = useRef(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

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
          throw new Error("Network response was not ok");
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

  // Add event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        router.push("/");
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        // Ctrl+Enter or Cmd+Enter (for Mac)
        e.preventDefault();
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading data...</div>;
  }

  const handleCancel = () => {
    router.push("/");
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGoal(data);
      router.push("/");
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return (
    <div>
      <main>
        <section id="hero">
          <form action={updateGoal} onSubmit={handleSubmit} ref={formRef}>
            <table className="table-width">
              <tbody>
                <tr>
                  <td>
                    <input type="hidden" value={data.id} readOnly />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Title</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) =>
                        setData({ ...data, title: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Description</label>
                  </td>
                  <td>
                    <textarea
                      value={data.description}
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="hidden"
                      value={data.statusId}
                      onChange={(e) =>
                        setData({ ...data, statusId: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Target Date</label>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={
                        new Date(data.targetDate).toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setData({ ...data, targetDate: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Status</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={data.status}
                      onChange={(e) =>
                        setData({ ...data, status: e.target.value })
                      }
                    />
                  </td>
                </tr>
                {data.tasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    {index > -1 && (
                      <tr>
                        <td colSpan="3">
                          <hr className="task-divider" />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="2">
                        <h3>Task {index + 1}</h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Task Title</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => {
                            const newTasks = [...data.tasks];
                            newTasks[index].title = e.target.value;
                            setData({ ...data, tasks: newTasks });
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Task Description</label>
                      </td>
                      <td>
                        <textarea
                          value={task.description}
                          onChange={(e) => {
                            const newTasks = [...data.tasks];
                            newTasks[index].description = e.target.value;
                            setData({ ...data, tasks: newTasks });
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Task Status</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={task.status}
                          onChange={(e) => {
                            const newTasks = [...data.tasks];
                            newTasks[index].status = e.target.value;
                            setData({ ...data, tasks: newTasks });
                          }}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr>
                  <td colSpan="2"></td>
                  <td style={{ textAlign: "right" }}>
                    <button type="submit">Submit</button>
                    &nbsp;|
                    <button type="button" onClick={handleCancel}>
                      &nbsp;Cancel
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="info-box">
                    <p>
                      <kbd>esc</kbd> back
                      <br />
                      <br />
                    </p>
                  </td>
                </tr>
              </tfoot>
            </table>
          </form>
        </section>
      </main>
    </div>
  );
}
