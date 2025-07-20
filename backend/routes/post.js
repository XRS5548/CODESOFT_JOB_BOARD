// Get all jobs created by the logged-in user
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const mongoUri = require('../utils/config');
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const UserauthMiddleware = require('../utils/AuthMiddleware');
dotenv.config();

const path = require("path");
const fs = require("fs");

const client = new MongoClient(mongoUri);
let conn = client.connect(function (err) {
    throw err;
})

router.get('/jobs', async (req, res) => {
    try {
        const db = client.db('jobboard');
        const collection = db.collection('jobs');
        const jobs = await collection.find({}).toArray();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post("/createjob", UserauthMiddleware, async (req, res) => {
    const { title, description, company, location, salary, type } = req.body;
    const user = req.user;
    try {
        const db = client.db('jobboard');
        const collection = db.collection('jobs');
        const newJob = { title, description, company, location, salary, type, user };
        await collection.insertOne(newJob);
        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = client.db('jobboard');
        const collection = db.collection('users');
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // 🔐 compare hash

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const db = client.db('jobboard');
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 🔐 hash password

        const newUser = { name, email, password: hashedPassword, role };
        await collection.insertOne(newUser);

        const token = jwt.sign({ id: newUser._id }, process.env.SECRETKEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.post("/userinfo", async function (req, res) {
    const token = req.body.token;
  
    if (!token) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }
  
    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
  
      try {
        // const client = await MongoClient.connect(mongoUri);
        const db = client.db("jobboard");
        const usersCollection = db.collection("users");
  
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
  
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
  
        return res.status(200).json({
          success: true,
          name: user.name,
          email: user.email,
          role: user.role
        });
      } catch (dbError) {
        console.error("DB Error:", dbError);
        return res.status(500).json({ success: false, message: "Database error" });
      }
    });
  });


router.post("/extracttoken", (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(200).json({ user: decoded });
    });
    
});


router.post("/jobs/token", UserauthMiddleware, async (req, res) => {
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



router.get("/jobs/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    const db = client.db("jobboard");
    const jobsCollection = db.collection("jobs");

    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/apply", UserauthMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    const {
      jobId,
      name,
      email,
      phone,
      linkedin,
      portfolio,
      coverLetter,
    } = req.body;

    const resume = req.files?.resume;

    // ✅ Validate required fields
    if (!jobId || !name || !email || !phone || !linkedin || !coverLetter || !resume) {
      return res.status(400).json({ error: "❌ Missing required fields or resume." });
    }

    // ✅ File path config
    const resumeDir = path.join(__dirname, "..", "public", "resumes");
    if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

    const fileExt = path.extname(resume.name);
    const fileName = `${Date.now()}_${userId}${fileExt}`;
    const savePath = path.join(resumeDir, fileName);

    // ✅ Move file to disk
    await resume.mv(savePath);

    const db = client.db("jobboard");
    const jobsCollection = db.collection("jobs");
    const applicationsCollection = db.collection("applications");

    // ✅ Check if job exists
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!job) return res.status(404).json({ error: "❌ Job not found" });

    // ✅ Prevent duplicate application
    const alreadyApplied = await applicationsCollection.findOne({
      jobId: new ObjectId(jobId),
      userId: new ObjectId(userId),
    });

    if (alreadyApplied) {
      return res.status(400).json({ error: "❌ You already applied to this job" });
    }

    // ✅ Store application with file path
    const applicationData = {
      jobId: new ObjectId(jobId),
      userId: new ObjectId(userId),
      name,
      email,
      phone,
      linkedin,
      portfolio,
      coverLetter,
      resumePath: `/resumes/${fileName}`, // 👈 relative URL for frontend
      createdAt: new Date(),
    };

    await applicationsCollection.insertOne(applicationData);

    res.status(200).json({ message: "✅ Successfully applied to the job." });
  } catch (err) {
    console.error("❌ Error applying to job:", err.stack || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;