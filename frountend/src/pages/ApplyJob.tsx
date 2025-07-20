import DefaultLayout from "@/layouts/default";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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

  // Check if job ID is valid from URL
  useEffect(() => {
    if (!id) {
      setMessage("❌ Job ID is missing from the URL.");
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
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
    formData.append("token", token); // ✅ body me token bhej rahe hain
    formData.append("resume", resume);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://codesoft-job-board.onrender.com/api/apply", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const resData = JSON.parse(xhr.responseText);
        setMessage("✅ Successfully applied to the job.");
      } else {
        const errData = JSON.parse(xhr.responseText);
        setMessage(`❌ ${errData.error || "Failed to apply"}`);
      }
      setLoading(false);
    };

    xhr.onerror = function () {
      setMessage("❌ Request failed");
      setLoading(false);
    };

    setLoading(true);
    xhr.send(formData);
  };


  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Apply for Job</h1>
        <p className="text-center mb-6 text-gray-500">Job ID: <code>{id}</code></p>

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
