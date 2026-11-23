
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getRecentActivities } = require("../controllers/activityController");

// Only Admin can view activity logs
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getRecentActivities
);

module.exports = router;
