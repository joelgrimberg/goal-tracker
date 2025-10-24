"use server";

import { redirect } from "next/navigation";

export async function createGoal(prevState, formData) {
  const title = formData.get("goal");
  const description = formData.get("description");
  const status = formData.get("status");

  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      status,
    }),
  };

  console.log("Creating goal with data:", { title, description, status });
  
  const res = await fetch("http://localhost:3000/goal", settings);
  const json = await res.json();
  
  console.log("Server response:", { status: res.status, data: json });
  
  if (!res.ok) {
    console.error("Failed to create goal:", json);
    return { message: `Failed to create goal: ${json.error || 'Unknown error'}` };
  }

  // Redirect to main page with success message in URL params
  redirect(`/?success=true&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`);
}
