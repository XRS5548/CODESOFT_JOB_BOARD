import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import {Card, CardHeader, CardBody} from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import API from "@/config/API";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
}

// const API = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/"; // replace as needed

export default function HRApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setError("❌ No token found. Please login.");
        setLoading(false);
        return;
      }


      try {
        const res = await fetch(`${API}myapplications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch applications");

        setApplications(data.applications);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API}setapplication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token, applicationId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  return (
      <section className=" py-12  ">
        <Card>
          <CardHeader>
            <CardHeader className="text-2xl">HR Dashboard</CardHeader>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-6">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <span color="danger">{error}</span>
            ) : applications.length === 0 ? (
              <span>No applications found.</span>
            ) : (
              <Table isStriped isCompact aria-label="All Applications Table">
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Email</TableColumn>
                  <TableColumn>Phone</TableColumn>
                  <TableColumn>Job Title</TableColumn>
                  <TableColumn>Company</TableColumn>
                  <TableColumn>Applied On</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Update</TableColumn>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.phone}</TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">{app.status}</TableCell>
                      <TableCell>
                        <Select
                          size="sm"
                          variant="flat"
                          aria-label="Select status"
                          selectedKeys={[app.status]}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value)
                          }
                        >
                          <SelectItem key="Applied">Applied</SelectItem>
                          <SelectItem key="Selected">Selected</SelectItem>
                          <SelectItem key="Rejected">Rejected</SelectItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </section>
  );
}
