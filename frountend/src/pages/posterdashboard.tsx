import { useState } from "react";
import DefaultLayout from "@/layouts/default";
// import JobsSection from "@/components/jobsection";
import {  Button } from "@heroui/react";
import MyJobs from "@/components/Myjobs";
import AddJob from "@/components/addjob";
import HRApplications from "./HRApplications";
// import { Select, SelectSection, SelectItem } from "@heroui/select";

// 👇 Dummy Components
const Overview = () => <div>📊 Overview coming soon...</div>;

// My Jobs Section ----------------------------------------------------------------------------



const Settings = () => <div>⚙️ Settings</div>;

// 👇 Sidebar Menu List
const menuList: { text: string; component: JSX.Element }[] = [
  { text: "Dashboard", component: <Overview /> },
  { text: "My Jobs", component: <MyJobs /> },
  { text: "Add Job", component: <AddJob /> },
  { text: "All Applications", component: <HRApplications /> },
  { text: "Settings", component: <Settings /> },

];

export default function PosterDashboard() {
  const [activeIndex, setActiveIndex] = useState(0); // Default active section

  return (
    <DefaultLayout>
      <div className="flex min-h-[70vh]">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            {menuList.map((item, index) => (
              <Button
                key={index}
                onClick={() => setActiveIndex(index)}
                color={activeIndex === index ? "primary" : "default"}
              >
                {item.text}
              </Button>
            ))}
            <hr />
          </div>
          <Button color="danger" onClick={() => {if(confirm("Are you sure you want to logout?"))  localStorage.removeItem("token") ;  window.location.href = "/login";}}>
            Logout
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {menuList[activeIndex].component}
        </main>
      </div>
    </DefaultLayout>
  );
}
