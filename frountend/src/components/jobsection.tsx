// components/JobsSection.tsx
import { useEffect, useState } from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/react";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description?: string;
  salary?: string;
};

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://codesoft-job-board.onrender.com/api/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section id="jobs" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 mb-5">
        <h2 className="text-3xl font-bold mb-8">Latest Job Listings</h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-red-500">No jobs found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-sky-600">{job.company}</p>
                <p className="text-sm">{job.location}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 border border-gray-400 rounded">
                  {job.type}
                </span>

                <div className="mt-4">
                  <a
                    href={`/jobs/${job._id}`}
                    className="text-blue-600 font-medium hover:underline text-sm"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </section>
  );
}
