// Get all jobs created by the logged-in user
router.get("/jobs/token", UserauthMiddleware, async (req, res) => {
  try {
    const db = client.db("jobboard");
    const jobsCollection = db.collection("jobs");

    const userId = req.user; // From middleware

    const jobs = await jobsCollection
      .find({ user: userId })
      .toArray();

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update a job (only if owned by user)
router.put("/update/token/:id", UserauthMiddleware, async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user; // From middleware
  const updatedData = req.body;

  try {
    const db = client.db("jobboard");
    const jobsCollection = db.collection("jobs");

    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(jobId), user: userId },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Delete a job (only if owned by user)
router.delete("/delete/token/:id", UserauthMiddleware, async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user; // From middleware

  try {
    const db = client.db("jobboard");
    const jobsCollection = db.collection("jobs");

    const result = await jobsCollection.deleteOne({
      _id: new ObjectId(jobId),
      user: userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
