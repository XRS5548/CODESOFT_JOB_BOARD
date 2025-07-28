import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  addToast,
} from "@heroui/react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";


interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
  linkedin?: string;
  portfolio?: string;
  coverLetter?: string;
  resumePath?: string;
}

export default function HRApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

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


   const handleStatusChangeforSelectedApp = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API}setapplication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setSelectedApp((prev) =>
        prev && prev._id === applicationId ? { ...prev, status: newStatus } : prev
      );
      addToast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}.`,
        color: "success",
      });

    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger",
      });
    }
  };



  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API}setapplication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      addToast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}.`,
        color: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger",
      });
    }
  };

  return (
    <section className="py-12">
      <Card>
        <CardHeader className="text-2xl">HR Dashboard</CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner variant="wave" size="lg" />
            </div>
          ) : error ? (
            <span className="text-red-500">{error}</span>
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
                  // console.log(app),
                  <TableRow
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className="cursor-pointer"
                  >
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{app.jobTitle}</TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{app.status}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
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

      {/* Modal for Application Details */}
      {selectedApp && (
        <Modal size="5xl" isOpen={!!selectedApp} onClose={() => setSelectedApp(null)}>

          <ModalContent className="max-h-[90vh] overflow-auto">
            <ModalHeader>Application Detail</ModalHeader>
            <ModalBody className="space-y-3 text-sm">
              <div>
                <strong>Name:</strong> {selectedApp.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedApp.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedApp.phone}
              </div>
              <div>
                <strong>Job Title:</strong> {selectedApp.jobTitle}
              </div>
              <div>
                <strong>Company:</strong> {selectedApp.company}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{selectedApp.status}</span>
              </div>
              <div>
                <strong>Applied At:</strong>{" "}
                {new Date(selectedApp.appliedAt).toLocaleString()}
              </div>

              {selectedApp.linkedin && (
                <div>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={selectedApp.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Profile
                  </a>
                </div>
              )}

              {selectedApp.portfolio && (
                <div>
                  <strong>Portfolio:</strong>{" "}
                  <a
                    href={selectedApp.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Portfolio
                  </a>
                </div>
              )}

              {selectedApp.coverLetter && (
                <div>
                  <strong>Cover Letter:</strong>
                  <div dangerouslySetInnerHTML={{ __html: selectedApp.coverLetter }} className=" p-3 rounded mt-1 whitespace-pre-line border text-sm font-mono">
                  </div>
                </div>
              )}

              {selectedApp.resumePath && (
                <div>
                  <strong>Resume:</strong>{" "}
                  <a
                    href={`https://codesoft-job-board.onrender.com${selectedApp.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Download Resume
                  </a>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-between items-center">

              <Select
                size="sm"
                variant="flat"
                aria-label="Select status"
                selectedKeys={[selectedApp.status]}
                onChange={(e) =>
                  handleStatusChangeforSelectedApp(selectedApp._id, e.target.value)
                }
              >
                <SelectItem key="Applied">Applied</SelectItem>
                <SelectItem key="Selected">Selected</SelectItem>
                <SelectItem key="Rejected">Rejected</SelectItem>
              </Select>
              <Button onClick={() => setSelectedApp(null)} color="primary">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </section>
  );
}
