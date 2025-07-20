import {
    Table, TableHeader, TableBody, TableColumn,
    TableRow, TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

type Job = {
    _id: string;
    title: string;
    description: string;
    createdAt?: string;
};

const API = "https://codesoft-job-board.onrender.com/api/";

const MyJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const token = localStorage.getItem("token");

    const fetchJobs = async () => {
        if (!token) return;

        try {
            const res = await fetch(`${API}jobs/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error("Error fetching user jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const res = await fetch(`${API}jobs/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");

            setJobs((prev) => prev.filter((job) => job._id !== id));
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    const handleEdit = (job: Job) => {
        setSelectedJob(job);
        onOpen();
    };

    const handleUpdate = async () => {
        if (!selectedJob) return;

        try {
            const res = await fetch(`${API}jobs/${selectedJob._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: selectedJob.title,
                    description: selectedJob.description,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");

            fetchJobs();
            onClose();
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <div className="overflow-auto py-10">
            <h2 className="text-2xl font-bold mb-6">My Posted Jobs</h2>

            {loading ? (
                <p>Loading...</p>
            ) : jobs.length === 0 ? (
                <p className="text-center text-gray-500">No jobs posted yet.</p>
            ) : (
                <Table aria-label="My Posted Jobs Table">
                    <TableHeader>
                        <TableColumn>Title</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Created At</TableColumn>
                        <TableColumn>Edit</TableColumn>
                        <TableColumn>Delete</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {jobs.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{job.description}</TableCell>
                                <TableCell>
                                    {job.createdAt
                                        ? new Date(job.createdAt).toLocaleDateString()
                                        : "—"}
                                </TableCell>
                                <TableCell>
                                    <Button color="warning" size="sm" onClick={() => handleEdit(job)}>
                                        Edit
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color="danger" size="sm" onClick={() => handleDelete(job._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Edit Job</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Title"
                            value={selectedJob?.title || ""}
                            onChange={(e) => setSelectedJob({ ...selectedJob!, title: e.target.value })}
                        />
                        <Input
                            label="Description"
                            value={selectedJob?.description || ""}
                            onChange={(e) => setSelectedJob({ ...selectedJob!, description: e.target.value })}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="light" onClick={onClose}>Cancel</Button>
                        <Button color="primary" onClick={handleUpdate}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default MyJobs;
