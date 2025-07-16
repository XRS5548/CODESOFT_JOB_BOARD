import  { useState, FormEvent } from 'react';
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

  const jobTypes = ["Full-Time", "Part-Time", "Internship", "Remote", "Freelance"];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = "Job title is required";
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.description) newErrors.description = "Job description is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Job submitted:", formData);
      alert("Job posted successfully!");
    }
  };

  const handleChange = (key: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">📝 Post a New Job</h1>

      <Form
        className="w-full flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={onSubmit}
      >
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

        <Button type="submit" color="primary" variant="solid">
          Post Job
        </Button>
      </Form>
    </div>
  );
}
