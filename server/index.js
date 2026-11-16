
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes = require("./routes/resultRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log("Request Received:", req.method, req.url);
  next();
});

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "University Management System Backend is running!",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notices", noticeRoutes);

console.log("All API Routes Loaded Successfully!");

// Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
  });
