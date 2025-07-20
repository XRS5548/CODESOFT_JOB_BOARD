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

type Job = {
    _id: string;
    title: string;
    description: string;
    createdAt?: string;
};

const MyJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("https://codesoft-job-board.onrender.com/api/jobs/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }), // 👈 token in body
                });

                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Error fetching user jobs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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
            )}
        </div>
    );
};

export default MyJobs;
