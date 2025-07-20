import DefaultLayout from "@/layouts/default";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ApplyJob() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token || !id) {
            setMessage("❌ Missing token or job ID.");
            return;
        }

        if (!name || !email || !phone || !linkedin || !coverLetter || !resume) {
            setMessage("❌ Please fill all required fields and upload resume.");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", id);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("linkedin", linkedin);
        formData.append("portfolio", portfolio);
        formData.append("coverLetter", coverLetter);
        formData.append("resume", resume);

        setLoading(true);
        try {
            const res = await fetch(`https://codesoft-job-board.onrender.com/api/apply`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to apply");

            setMessage("✅ Successfully applied for the job.");
        } catch (err: any) {
            setMessage(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Apply for Job</h1>
                <p className="text-center mb-6">Job ID: <code>{id}</code></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="url"
                        placeholder="LinkedIn Profile"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="url"
                        placeholder="Portfolio Website (optional)"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        placeholder="Cover Letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full border p-2 rounded h-32"
                        required
                    />

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResume(e.target.files?.[0] || null)}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border p-2 rounded hover:bg-black hover:text-white transition"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>

                    {message && <p className="text-center mt-2">{message}</p>}
                </form>
            </div>
        </DefaultLayout>
    );
}
