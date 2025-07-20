import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    const { id } = useParams();
    const navigate = useNavigate();
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
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // If token is required in body, use POST instead.
                    },
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
    if (error) return <div className="p-4 text-center">❌ {error}</div>;
    if (!job) return <div className="p-4 text-center">No job found.</div>;

    return (
        <DefaultLayout>
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="text-lg font-semibold">{job.company}</p>
                    <p className="text-sm">
                        📍 {job.location} | 🕒 {job.jobType}
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">📝 Job Description</h2>
                    <p className="whitespace-pre-line">{job.description}</p>
                </div>

                <p className="text-sm">
                    Posted on: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                </p>

                <div>
                    <button
                        onClick={() => navigate(`/apply/${job._id}`)}
                        className="px-4 py-2 rounded-lg border hover:bg-black hover:text-white transition"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </DefaultLayout>
    );
}
