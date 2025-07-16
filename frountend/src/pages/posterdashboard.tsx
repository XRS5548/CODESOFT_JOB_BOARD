import { useState } from "react";
import DefaultLayout from "@/layouts/default";
// import JobsSection from "@/components/jobsection";
import {  Button } from "@heroui/react";
// import { Select, SelectSection, SelectItem } from "@heroui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import AddJob from "@/components/addjob";

// 👇 Dummy Components
const Overview = () => <div>📊 Overview coming soon...</div>;

// My Jobs Section ----------------------------------------------------------------------------
const MyJobs = () => {
  return (
    <div className="overflow-auto">
      <Table aria-label="My Posted Jobs">
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Edit</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>Software Engineer Intern</TableCell>
              <TableCell>
                A software intern program requiring knowledge of Java, Python, etc.
              </TableCell>
              <TableCell>25/07/2025</TableCell>
              <TableCell>
                <Button color="warning" size="sm">
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button color="danger" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Settings = () => <div>⚙️ Settings</div>;

// 👇 Sidebar Menu List
const menuList: { text: string; component: JSX.Element }[] = [
  { text: "Dashboard", component: <Overview /> },
  { text: "My Jobs", component: <MyJobs /> },
  { text: "Add Job", component: <AddJob /> },
  { text: "Settings", component: <Settings /> },
];

export default function PosterDashboard() {
  const [activeIndex, setActiveIndex] = useState(0); // Default active section

  return (
    <DefaultLayout>
      <div className="flex h-screen">
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
          <Button color="danger" onClick={() => alert("Logout")}>
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
