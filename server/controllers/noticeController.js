
const Notice = require("../models/Notice");

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create notice
exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
