
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getMonthlyEnrollment,
} = require("../controllers/studentController");

// Login required for all routes
router.use(authMiddleware);

// Admin and Teacher can view students
router.get(
  "/",
  roleMiddleware("admin", "teacher"),
  getAllStudents
);

// Admin only: Monthly enrollment
router.get(
  "/enrollment/monthly",
  roleMiddleware("admin"),
  getMonthlyEnrollment
);

// Admin and Teacher can view individual student
router.get(
  "/:id",
  roleMiddleware("admin", "teacher"),
  getStudentById
);

// Admin only: Student management
router.post("/", roleMiddleware("admin"), createStudent);
router.put("/:id", roleMiddleware("admin"), updateStudent);
router.delete("/:id", roleMiddleware("admin"), deleteStudent);

module.exports = router;
