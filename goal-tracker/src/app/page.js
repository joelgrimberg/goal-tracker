"use client";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Todos from "./components/todos";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/feed/goals",
    fetcher,
  );
  const [selectedRow, setSelectedRow] = useState(-1);
  const [hoverText, setHoverText] = useState("");

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        window.location.href =
          "http://localhost:3001/goal/edit/" + data[selectedRow].id;
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
      } else if (event.key === "Escape") {
        setSelectedRow(-1); // Reset the selected row
        setHoverText(""); // Remove the hover text
      } else if (event.key === "t" && selectedRow !== -1) {
        handleDelete(selectedRow);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedRow]);

  const handleRowClick = (index, goalId) => {
    setSelectedRow(index);
    window.location.href = "http://localhost:3000/goal/" + goalId;
    // setHoverText(data[index].description);
  };

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
      <main>
        <img id="background" src="background.svg" alt="" fetchPriority="high" />
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
                  onClick={() => handleRowClick(index, goal.id)}
                  onMouseEnter={() => handleRowHover(index)}
                >
                  <td className="break-word fixed-width-600">{goal.title}</td>
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
                    <kbd>i</kbd> info <br />
                    <kbd>e</kbd> edit [todo] <br />
                    <kbd>t</kbd> trash
                    <br />
                  </p>
                </td>
                <td className="info-box">
                  <p>
                    <kbd>g</kbd> add goal [todo]
                    <br />
                    <kbd>s</kbd> add subgoal [todo]
                    <br />
                  </p>
                </td>

                <td className="info-box">
                  <p>
                    <kbd>enter</kbd> select [todo] <br />
                    <kbd>esc</kbd> cancel
                    <br />
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
    </div>
  );
}
