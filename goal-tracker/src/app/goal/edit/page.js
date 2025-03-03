"use client";
import { useSearchParams } from "next/navigation";

export default function GoalDetails({ searchParams }) {
  const Id = searchParams.id;

  return (
    <div>
      <main>{Id}</main>
    </div>
  );
}
