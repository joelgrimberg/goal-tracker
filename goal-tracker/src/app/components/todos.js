import { useRef, useState, useEffect } from "react";

export default function Todos() {
  const lowerBoxRef = useRef(null);
  const upperBoxRef = useRef(null);
  const [isLowerBoxExpanded, setIsLowerBoxExpanded] = useState(false);
  const [isUpperBoxExpanded, setIsUpperBoxExpanded] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState("");
  const [batteryCharging, setBatteryCharging] = useState("");
  const [batteryIconColor, setBatteryIconColor] = useState("green");

  const handleLowerBoxClick = () => {
    setIsLowerBoxExpanded(!isLowerBoxExpanded);
    setIsUpperBoxExpanded(false);
  };

  const handleUpperBoxClick = () => {
    setIsUpperBoxExpanded(!isUpperBoxExpanded);
    setIsLowerBoxExpanded(false);
  };

  useEffect(() => {
    navigator.getBattery().then((battery) => {
      function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
      }
      updateAllBatteryInfo();

      battery.addEventListener("chargingchange", () => {
        updateChargeInfo();
      });

      battery.addEventListener("levelchange", () => {
        updateLevelInfo();
      });

      function updateChargeInfo() {
        setBatteryCharging(
          `🔋 Battery charging? ${battery.charging ? "Yes" : "No"}`,
        );
      }

      function updateLevelInfo() {
        const roundedLevel = Math.round(battery.level * 100);
        setBatteryLevel(`Battery level: ${roundedLevel}%`);
        setBatteryIconColor(roundedLevel < 20 ? "red" : "green");
      }
    });
  }, []);

  return (
    <div>
      <div
        id="upperBox"
        className={`box ${isUpperBoxExpanded ? "show" : ""}`}
        ref={upperBoxRef}
      >
        <svg
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleUpperBoxClick}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M24.667 12c1.333 1.414 2 3.192 2 5.334 0 4.62-4.934 5.7-7.334 12C18.444 28.567 18 27.456 18 26c0-4.642 6.667-7.053 6.667-14Zm-5.334-5.333c1.6 1.65 2.4 3.43 2.4 5.333 0 6.602-8.06 7.59-6.4 17.334C13.111 27.787 12 25.564 12 22.666c0-4.434 7.333-8 7.333-16Zm-6-5.333C15.111 3.555 16 5.556 16 7.333c0 8.333-11.333 10.962-5.333 22-3.488-.774-6-4-6-8 0-8.667 8.666-10 8.666-20Z"
            fill="#111827"
          ></path>
        </svg>
        <h2>Goals</h2>
        <ul>
          <li>
            <p>Add Notes</p>
          </li>
          <li>
            <p>Expand Subitems</p>
          </li>
          <li>
            <p>Add Form</p>
          </li>
          <li>
            <p>Edit Form</p>
          </li>
          <li>
            <p>Add subGoal Form</p>
          </li>
          <li>
            <p>Edit subGoal Form</p>
          </li>
          <li>
            <p>Create Login</p>
          </li>
          <li>
            <p>Add Menu</p>
          </li>
          <li>
            <p>Show msg when no goals are fetched</p>
          </li>
          <li>
            <p>Expand Help Keys</p>
          </li>{" "}
          <li>
            <p>Expand Help Keys</p>
          </li>
          <li>
            <p>Show Todo's from backend</p>
          </li>
        </ul>
      </div>
      <div
        id="lowerBox"
        className={`box ${isLowerBoxExpanded ? "show" : ""}`}
        ref={lowerBoxRef}
      >
        <svg
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleLowerBoxClick}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M24.667 12c1.333 1.414 2 3.192 2 5.334 0 4.62-4.934 5.7-7.334 12C18.444 28.567 18 27.456 18 26c0-4.642 6.667-7.053 6.667-14Zm-5.334-5.333c1.6 1.65 2.4 3.43 2.4 5.333 0 6.602-8.06 7.59-6.4 17.334C13.111 27.787 12 25.564 12 22.666c0-4.434 7.333-8 7.333-16Zm-6-5.333C15.111 3.555 16 5.556 16 7.333c0 8.333-11.333 10.962-5.333 22-3.488-.774-6-4-6-8 0-8.667 8.666-10 8.666-20Z"
            fill="#111827"
          ></path>
        </svg>
        <h2>
          <span style={{ color: batteryIconColor }}>🔋</span> {batteryLevel}
        </h2>
        <ul>
          <li>
            <p>
              <span
                dangerouslySetInnerHTML={{ __html: batteryCharging }}
              ></span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
