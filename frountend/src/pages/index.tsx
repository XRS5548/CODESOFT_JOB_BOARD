import HeroSection from "@/components/Hero";
import DefaultLayout from "@/layouts/default";
import JobsSection from '@/components/jobsection'

export default function IndexPage() {
  return (
    <DefaultLayout>
      <HeroSection />
      <JobsSection />
    </DefaultLayout>
  );
}
