"use server";

import { redirect } from "next/navigation";

export async function updateGoal(goalData) {
  console.log("Updating goal:", goalData);

  const settings = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: goalData.title,
      description: goalData.description,
      status: goalData.status,
      targetDate: goalData.targetDate,
    }),
  };

  try {
    const res = await fetch(`http://localhost:3000/goal/${goalData.id}`, settings);
    const json = await res.json();
    
    if (!res.ok) {
      console.error("Failed to update goal:", json);
      return { error: "Failed to update goal" };
    }

    console.log("Goal updated successfully:", json);
  } catch (error) {
    console.error("Error updating goal:", error);
    return { error: "An error occurred while updating the goal" };
  }
  
  // Redirect to main page after successful update
  redirect("/");
}
