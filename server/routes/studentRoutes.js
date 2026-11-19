
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

// Admin only
router.use(authMiddleware, roleMiddleware("admin"));

// Student routes
router.get("/", getAllStudents);

// Monthly enrollment route (must be before /:id)
router.get("/enrollment/monthly", getMonthlyEnrollment);

router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
