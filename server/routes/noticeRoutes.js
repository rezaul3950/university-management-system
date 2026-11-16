
const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All logged-in users can view notices
router.get("/", authMiddleware, getAllNotices);
router.get("/:id", authMiddleware, getNoticeById);

// Only Admin can manage notices
router.post("/", authMiddleware, roleMiddleware("admin"), createNotice);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateNotice);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteNotice);

module.exports = router;
