
const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All logged-in users can view attendance
router.get("/", authMiddleware, getAllAttendance);
router.get("/:id", authMiddleware, getAttendanceById);

// Admin and Teacher can manage attendance
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  createAttendance
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  updateAttendance
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  deleteAttendance
);

module.exports = router;
