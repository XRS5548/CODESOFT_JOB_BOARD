import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
  createdAt?: string;
};

export default function JobDetailsPage() {
  const { id } = useParams(); // extract job id from URL
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token || !id) {
        setError("Token or job ID missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://codesoft-job-board.onrender.com/api/jobs/${id}`, {
          method: "POST", // token body me bhejna hai
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading job details...</div>;
  if (error) return <div className="p-4 text-center text-red-500">❌ {error}</div>;
  if (!job) return <div className="p-4 text-center">No job found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-lg font-semibold text-gray-700 mb-2">{job.company}</p>
      <p className="text-sm text-gray-500 mb-4">
        📍 {job.location} | 🕒 {job.jobType}
      </p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📝 Job Description</h2>
        <p className="text-gray-800 whitespace-pre-line">{job.description}</p>
      </div>
      <p className="text-sm text-gray-400">
        Posted on: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
}
