// backend/index.js

const express = require("express");
const cors = require("cors");
const post = require("./routes/post");
const fileupload = require("express-fileupload");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes


// Static Files
app.use(express.static("public"));
app.use(fileupload({
  createParentPath: true
}));


app.use("/api", post);



// Routes
app.get("/", (req, res) => {
  res.send("🚀 JobBoard Backend is Running!");
});

// Server Start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
