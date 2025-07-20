import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";

interface Application {
    _id: string;
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    company: string;
    status: string;
    appliedAt: string;
}

export default function HRApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchApplications = async () => {
            if (!token) {
                setError("❌ No token found. Please login.");
                return;
            }

            try {
                const res = await fetch(`${API}myapplications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    token,
                }),
            });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch applications");

                setApplications(data.applications);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [token]);

    const handleStatusChange = async (applicationId: string, newStatus: string) => {
        try {
            const res = await fetch(`${API}setapplication`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    token,
                    applicationId,
                    status: newStatus,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update status");

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err: any) {
            alert("❌ " + err.message);
        }
    };

    return (
        <DefaultLayout>
            <section className="w-full py-12 px-4 max-w-6xl mx-auto space-y-10">
                <h2 className="text-2xl font-bold">HR Dashboard</h2>

                {loading && <p>Loading applications...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && applications.length === 0 && (
                    <p>No applications found.</p>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border rounded-xl">
                            <thead>
                                <tr className="border-b bg-gray-100">
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Phone</th>
                                    <th className="p-3 text-left">Job Title</th>
                                    <th className="p-3 text-left">Company</th>
                                    <th className="p-3 text-left">Applied On</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">{app.name}</td>
                                        <td className="p-3">{app.email}</td>
                                        <td className="p-3">{app.phone}</td>
                                        <td className="p-3">{app.jobTitle}</td>
                                        <td className="p-3">{app.company}</td>
                                        <td className="p-3">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        <td className="p-3 capitalize">{app.status}</td>
                                        <td className="p-3">
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                className="border px-2 py-1 rounded"
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="Selected">Selected</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </DefaultLayout>
    );
}
