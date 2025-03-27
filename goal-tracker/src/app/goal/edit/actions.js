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

  // const res = await fetch("http://localhost:3000/goal", settings);
  // const json = await res.json();
  // console.log(res);
  // if (!res.ok) {
  //   return { message: "Please enter a valid email" };
  // }
  //
  // redirect("/dashboard");
}
