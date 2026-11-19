
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getMonthlyEnrollment,
} = require("../controllers/teacherController");

// Admin only
router.use(authMiddleware, roleMiddleware("admin"));

router.get("/", getAllTeachers);

// Monthly teacher enrollment
router.get("/enrollment/monthly", getMonthlyEnrollment);

router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
