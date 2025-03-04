"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GoalDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <main>
        <form>
          <div>
            <label>ID:</label>
            <input type="text" value={data.id} readOnly />
          </div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
          <div>
            <label>Status ID:</label>
            <input
              type="number"
              value={data.statusId}
              onChange={(e) => setData({ ...data, statusId: e.target.value })}
            />
          </div>
          <div>
            <label>Target Date:</label>
            <input
              type="date"
              value={new Date(data.targetDate).toISOString().split("T")[0]}
              onChange={(e) => setData({ ...data, targetDate: e.target.value })}
            />
          </div>
          <div>
            <label>Status:</label>
            <input
              type="text"
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
            />
          </div>
          <div>
            <label>Tasks:</label>
            {data.tasks.map((task, index) => (
              <div key={task.id}>
                <h3>Task {index + 1}</h3>
                <div>
                  <label>Task Title:</label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => {
                      const newTasks = [...data.tasks];
                      newTasks[index].title = e.target.value;
                      setData({ ...data, tasks: newTasks });
                    }}
                  />
                </div>
                <div>
                  <label>Task Description:</label>
                  <textarea
                    value={task.description}
                    onChange={(e) => {
                      const newTasks = [...data.tasks];
                      newTasks[index].description = e.target.value;
                      setData({ ...data, tasks: newTasks });
                    }}
                  />
                </div>
                <div>
                  <label>Task Status:</label>
                  <input
                    type="text"
                    value={task.status}
                    onChange={(e) => {
                      const newTasks = [...data.tasks];
                      newTasks[index].status = e.target.value;
                      setData({ ...data, tasks: newTasks });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}
