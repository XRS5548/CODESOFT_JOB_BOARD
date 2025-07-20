import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";

interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
}

export default function SeekerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("❌ No token found. Please login.");
        return;
      }

      try {
        const res = await fetch("https://codesoft-job-board.onrender.com/api/applications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setApplications(data.applications);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const totalApplied = applications.length;
  const totalSelected = applications.filter((app) => app.status === "Selected").length;

  return (
    <DefaultLayout>
      <section className="w-full py-12 px-4 max-w-6xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold">Job Seeker Dashboard</h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-2">Jobs Applied</h3>
                <p className="text-3xl font-bold">{totalApplied}</p>
              </div>
              <div className="p-6 border rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-2">Jobs Selected</h3>
                <p className="text-3xl font-bold">{totalSelected}</p>
              </div>
            </div>

            {/* Applications List */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-xl">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Job Title</th>
                    <th className="text-left p-3">Company</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b hover:bg-muted transition">
                      <td className="p-3">{app.jobTitle}</td>
                      <td className="p-3">{app.company}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            app.status === "Selected"
                              ? "text-green-600"
                              : app.status === "Rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </DefaultLayout>
  );
}
