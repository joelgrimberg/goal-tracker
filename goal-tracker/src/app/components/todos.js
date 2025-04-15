import React, { useEffect, useState } from "react";

const Todos = () => {
  const [batteryInfo, setBatteryInfo] = useState(null);

  useEffect(() => {
    if (navigator.getBattery) {
      navigator
        .getBattery()
        .then((battery) => {
          setBatteryInfo({
            level: battery.level,
            charging: battery.charging,
          });

          // Optional: Add event listeners for battery changes
          const updateBatteryInfo = () => {
            setBatteryInfo({
              level: battery.level,
              charging: battery.charging,
            });
          };

          battery.addEventListener("levelchange", updateBatteryInfo);
          battery.addEventListener("chargingchange", updateBatteryInfo);

          // Cleanup event listeners on unmount
          return () => {
            battery.removeEventListener("levelchange", updateBatteryInfo);
            battery.removeEventListener("chargingchange", updateBatteryInfo);
          };
        })
        .catch((error) => {
          console.error("Error accessing Battery API:", error);
        });
    } else {
      console.warn("Battery API is not supported in this browser.");
    }
  }, []);

  if (!navigator.getBattery) {
    return <div />;
  }

  return (
    <div>
      {batteryInfo ? (
        <div>
          <p>Battery Level: {batteryInfo.level * 100}%</p>
          <p>Charging: {batteryInfo.charging ? "Yes" : "No"}</p>
        </div>
      ) : (
        <p>Loading battery information...</p>
      )}
    </div>
  );
};

export default Todos;
