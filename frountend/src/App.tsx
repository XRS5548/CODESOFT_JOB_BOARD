import DefaultLayout from "@/layouts/default";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ApplyJob() {
    const { id } = useParams(); // job ID from URL
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleApply = async () => {
        const token = localStorage.getItem("token");

        if (!token || !id) {
            setMessage("Missing token or job ID.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`https://codesoft-job-board.onrender.com/api/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, jobId: id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to apply.");
            }

            setMessage("✅ Successfully applied for the job.");
        } catch (err: any) {
            setMessage(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="max-w-md mx-auto p-6 space-y-4 text-center">
                <h1 className="text-2xl font-bold">Apply for Job</h1>
                <p>Job ID: <code>{id}</code></p>

                <button
                    className="px-4 py-2 border rounded hover:bg-black hover:text-white transition"
                    onClick={handleApply}
                    disabled={loading}
                >
                    {loading ? "Applying..." : "Submit Application"}
                </button>

                {message && <p>{message}</p>}
            </div>
        </DefaultLayout>
    );
}
