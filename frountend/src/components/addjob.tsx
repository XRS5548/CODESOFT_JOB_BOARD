import { useState, FormEvent } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Form, Input, Button, Textarea } from "@heroui/react";

type JobFormData = {
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
};

type FormErrors = Partial<Record<keyof JobFormData, string>>;

export default function AddJob() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const jobTypes = ["Full-Time", "Part-Time", "Internship", "Remote", "Freelance"];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = "Job title is required";
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.description) newErrors.description = "Job description is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to post a job.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API+"createjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          location: formData.location,
          type: formData.jobType,
          description: formData.description,
          salary: "",
          token: token, // 👈 Token is sent in body
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Job posted successfully!");
        setFormData({
          title: "",
          company: "",
          location: "",
          jobType: "",
          description: "",
        });
      } else {
        alert(`❌ Failed to post job: ${data?.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error posting job:", err);
      alert("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">📝 Post a New Job</h1>

      <Form className="w-full flex flex-col gap-4" validationErrors={errors} onSubmit={onSubmit}>
        <Input
          label="Job Title"
          name="title"
          placeholder="e.g. Frontend Developer"
          value={formData.title}
          onValueChange={(v) => handleChange("title", v)}
          labelPlacement="outside"
        />

        <Input
          label="Company Name"
          name="company"
          placeholder="e.g. Codesoft Inc."
          value={formData.company}
          onValueChange={(v) => handleChange("company", v)}
          labelPlacement="outside"
        />

        <Input
          label="Location"
          name="location"
          placeholder="e.g. Remote / Delhi / Bangalore"
          value={formData.location}
          onValueChange={(v) => handleChange("location", v)}
          labelPlacement="outside"
        />

        <Select
          label="Job Type"
          labelPlacement="outside"
          name="jobType"
          selectedKeys={formData.jobType ? [formData.jobType] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            handleChange("jobType", selected);
          }}
        >
          {jobTypes.map((type) => (
            <SelectItem key={type}>{type}</SelectItem>
          ))}
        </Select>

        <Textarea
          label="Job Description"
          name="description"
          placeholder="Describe the job role and responsibilities..."
          value={formData.description}
          onValueChange={(v) => handleChange("description", v)}
          labelPlacement="outside"
        />

        <Button type="submit" color="primary" variant="solid" isLoading={loading}>
          {loading ? "Posting..." : "Post Job"}
        </Button>
      </Form>
    </div>
  );
}
