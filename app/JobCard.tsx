"use client";
import { Job } from "@/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-md bg-gray-900 p-4 text-sm">
      <div className="font-mono opacity-60">{job.id.slice(0, 8)}</div>
      <div>{job.type}</div>
    </div>
  );
}
