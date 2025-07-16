// components/HeroSection.tsx

export default function HeroSection() {
  return (
    <section className="w-full  py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        {/* Left Side: Text & Buttons */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold  leading-tight mb-4">
            Discover the Best Jobs or Post Your Own
          </h1>
          <p className="text-lg  mb-6">
            Internship/projects ke liye perfect matches. Simple, fast, aur effective.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a
              href="#jobs"
              className="inline-block px-6 py-3 bg-blue-600 font-medium rounded-md hover:bg-blue-700 transition"
            >
              Find Jobs
            </a>
            <a
              href="/post-job"
              className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition"
            >
              Post a Job
            </a>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src="/job.jpeg"
            alt="Work Illustration"
            className="w-full max-w-sm"
          />
        </div>
      </div>
    </section>
  );
}
