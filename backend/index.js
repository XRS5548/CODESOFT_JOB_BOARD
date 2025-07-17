// backend/index.js

const express = require("express");
const cors = require("cors");
const post = require("./routes/post");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", post);

// Static Files
app.use(express.static("public"));



// Routes
app.get("/", (req, res) => {
  res.send("🚀 JobBoard Backend is Running!");
});

// Server Start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
