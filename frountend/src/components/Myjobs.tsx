import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Spinner } from "@heroui/spinner";

type Job = {
    _id: string;
    title: string;
    description: string;
    createdAt?: string;
};

const MyJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const token = localStorage.getItem("token");

    const fetchJobs = async () => {
        if (!token) return;

        try {
            const res = await fetch("https://codesoft-job-board.onrender.com/api/jobs/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error("❌ Error fetching jobs:", err);
        } finally {
            setTimeout(() => {
            setLoading(false);
                
            }, 2000);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const deleteJob = async (jobId: string) => {
        try {
            const res = await fetch(`https://codesoft-job-board.onrender.com/api/jobs/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, jobId }),
            });

            const data = await res.json();
            if (res.ok) {
                setJobs(jobs.filter((job) => job._id !== jobId));
                alert("✅ Job deleted successfully");
            } else {
                alert("❌ " + data.error);
            }
        } catch (err) {
            console.error("❌ Error deleting job:", err);
        }
    };

    const openEditModal = (job: Job) => {
        setEditingJob(job);
        setNewTitle(job.title);
        setNewDescription(job.description);
    };

    const saveEdit = async () => {
        if (!editingJob) return;

        try {
            const res = await fetch(`https://codesoft-job-board.onrender.com/api/jobs/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    jobId: editingJob._id,
                    title: newTitle,
                    description: newDescription,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setJobs((prev) =>
                    prev.map((job) =>
                        job._id === editingJob._id
                            ? { ...job, title: newTitle, description: newDescription }
                            : job
                    )
                );
                setEditingJob(null);
            } else {
                alert("❌ " + data.error);
            }
        } catch (err) {
            console.error("❌ Error editing job:", err);
        }
    };

    return (
        <div className="overflow-auto py-10">
            <h2 className="text-2xl font-bold mb-6">My Posted Jobs</h2>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Spinner size="lg" variant="wave" />
                </div>
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
                                <TableCell>
                                    {job.description.length > 60
                                        ? job.description.substring(0, 60) + "..."
                                        : job.description}
                                </TableCell>
                                <TableCell>
                                    {job.createdAt
                                        ? new Date(job.createdAt).toLocaleDateString()
                                        : "—"}
                                </TableCell>
                                <TableCell>
                                    <Button color="warning" size="sm" onClick={() => openEditModal(job)}>
                                        Edit
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color="danger" size="sm" onClick={() => deleteJob(job._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Edit Modal */}
            <Modal size="full" className="w-[100vw]" isOpen={!!editingJob} onClose={() => setEditingJob(null)}>
                <ModalContent >
                    <ModalHeader>Edit Job</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <label className="text-sm font-medium mt-4 block">Description</label>
                        <ReactQuill style={{height:"600px"}} theme="snow" value={newDescription} onChange={(e) => setNewDescription(e)} />
                        {/* <textarea
                            className="w-full border rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Job Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        ></textarea> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setEditingJob(null)} variant="ghost">Cancel</Button>
                        <Button onClick={saveEdit} color="primary">Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default MyJobs;
