
const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All logged-in users can view courses
router.get("/", authMiddleware, getAllCourses);
router.get("/:id", authMiddleware, getCourseById);

// Only Admin can add, update and delete courses
router.post("/", authMiddleware, roleMiddleware("admin"), createCourse);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateCourse);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCourse);

module.exports = router;
