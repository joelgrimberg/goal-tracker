"use server";

export async function updateGoal(formData) {
  console.log(formData);

  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
    },
  };
}
