
const Attendance = require("../models/Attendance");

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create attendance
exports.createAttendance = async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json({
      success: true,
      message: "Attendance created successfully",
      data: record,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
