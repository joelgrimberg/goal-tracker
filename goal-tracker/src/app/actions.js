"use server";

export async function createPost(formData) {
  console.log(formData);
  const title = formData.get("title");
  const content = formData.get("content");
}
