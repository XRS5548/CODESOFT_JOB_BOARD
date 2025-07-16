"use client";

import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import  { useState, ChangeEvent, FormEvent } from "react";

type FormDataType = {
  name: string;
  email: string;
  resume: File | null;
  coverLetter: string;
};

export default function ApplyForm() {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    resume: null,
    coverLetter: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    // Example: FormData send to backend
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    if (formData.resume) payload.append("resume", formData.resume);
    payload.append("coverLetter", formData.coverLetter);

    // TODO: use fetch to POST this payload to backend
  };

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Apply for a Job</h1>
        <h2>
          Job:{" "}
          <span className="font-medium">
            Data Science Engineer, at Deloitte
          </span>
        </h2>
        <hr />

        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <Input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email Address</label>
          <Input
            type="email"
            name="email"
            required
            placeholder="e.g. example@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Resume (PDF)</label>
          <Input
            type="file"
            name="resume"
            accept=".pdf"
            required
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Cover Letter (optional)
          </label>
          <Textarea
            name="coverLetter"
            rows={4}
            placeholder="Write your cover letter here..."
            value={formData.coverLetter}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" color="primary">
          Submit Application
        </Button>
      </form>
    </DefaultLayout>
  );
}
