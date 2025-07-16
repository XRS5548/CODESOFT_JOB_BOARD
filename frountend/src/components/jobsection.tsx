// components/JobsSection.tsx
import { Pagination } from "@heroui/pagination";
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
    type: "Internship",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeGen",
    location: "Bangalore",
    type: "Full-time",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignX",
    location: "Delhi",
    type: "Internship",
  },
];

export default function JobsSection() {
  return (
    <section id="jobs" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 mb-5">
        <h2 className="text-3xl font-bold mb-8">Latest Job Listings</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sky-600">{job.company}</p>
              <p className="text-sm">{job.location}</p>
              <span className="inline-block mt-2 text-xs px-2 py-1 border border-gray-400 rounded">
                {job.type}
              </span>

              <div className="mt-4">
                <a
                  href={`/jobs/${job.id}`}
                  className="text-blue-600 font-medium hover:underline text-sm"
                >
                  Apply Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Pagination total={3} initialPage={1} onChange={(page) => console.log("Page:", page)} />
      </div>
    </section>
  );
}
