
const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All logged-in users can view results
router.get("/", authMiddleware, getAllResults);
router.get("/:id", authMiddleware, getResultById);

// Admin and Teacher can manage results
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  createResult
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  updateResult
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  deleteResult
);

module.exports = router;
