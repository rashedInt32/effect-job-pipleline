"use client";
import { useEffect, useState } from "react";
import { Job } from "@/types";

const jobType: Job["type"][] = [
  "resize-image",
  "generate-report",
  "send-email",
];
const columnList: Job["status"][] = [
  "queued",
  "processing",
  "completed",
  "failed",
];

export default function Home() {
  const [jobs, setJobs] = useState<Map<string, Job>>(new Map());
  const [selectedType, setSelectedType] = useState<Job["type"]>("resize-image");

  useEffect(() => {
    const es = new EventSource("/api/jobs/stream");
    es.onmessage = (e) => {
      const incoming: Job = JSON.parse(e.data);
      setJobs((prev) => new Map(prev).set(incoming.id, incoming));
    };
    return () => es.close();
  }, []);

  const submitJob = async () => {
    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: selectedType }),
    });
  };

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center
  bg-zinc-50 font-sans dark:bg-black"
    >
      <main
        className="flex flex-col flex-1 w-full max-w-7xl py-16
  px-16 bg-white dark:bg-black gap-6"
      >
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as Job["type"])}
            className="bg-gray-800 text-white px-3 py-2 rounded"
          >
            {jobType.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={submitJob}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Job
          </button>
        </div>

        <div
          className="flex items-start justify-between gap-4 h-full
"
        >
          {columnList.map((column) => {
            const jobsInColumn = Array.from(jobs.values()).filter(
              (j) => j.status === column,
            );
            return (
              <div
                key={column}
                className="bg-gray-800 w-full rounded-md h-full p-6
  min-h-100"
              >
                <h2
                  className="uppercase font-bold border-b pb-2
  border-black mb-3"
                >
                  {column}
                </h2>
                <div className="flex flex-col gap-2">
                  {jobsInColumn.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-md bg-gray-900 p-4 mb-4 text-sm">
      <div className="font-mono opacity-60">{job.id.slice(0, 8)}</div>
      <div>{job.type}</div>
    </div>
  );
}
