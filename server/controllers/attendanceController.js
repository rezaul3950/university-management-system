
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Find student using MongoDB ID
const getStudentDetails = async (studentMongoId) => {
  if (!studentMongoId || !mongoose.Types.ObjectId.isValid(studentMongoId)) {
    throw new Error("Please select a valid student.");
  }

  const student = await User.findOne({
    _id: studentMongoId,
    role: "student",
  }).select("name studentId department");

  if (!student) {
    throw new Error("Student not found.");
  }

  return {
    studentRef: student._id,
    student: student.name,
    studentId: student.studentId || "",
    department: student.department || "",
  };
};

// Get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create attendance
exports.createAttendance = async (req, res) => {
  try {
    const { date, course, studentMongoId, status } = req.body;

    if (!date || !course || !studentMongoId) {
      return res.status(400).json({
        success: false,
        message: "Date, course and student are required.",
      });
    }

    const studentDetails = await getStudentDetails(studentMongoId);

    const teacher = await User.findById(req.user.id).select("name");

    const record = await Attendance.create({
      date,
      course,
      ...studentDetails,
      teacherId: req.user.role === "teacher" ? req.user.id : null,
      teacherName:
        req.user.role === "teacher" ? teacher?.name || "" : "",
      recordedByRole: req.user.role,
      status: status || "Present",
    });

    res.status(201).json({
      success: true,
      message: "Attendance created successfully.",
      data: record,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { date, course, studentMongoId, status } = req.body;

    const record = await Attendance.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    const studentDetails = await getStudentDetails(studentMongoId);

    record.date = date || record.date;
    record.course = course || record.course;
    record.studentRef = studentDetails.studentRef;
    record.student = studentDetails.student;
    record.studentId = studentDetails.studentId;
    record.department = studentDetails.department;
    record.status = status || record.status;

    await record.save();

    res.json({
      success: true,
      message: "Attendance updated successfully.",
      data: record,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    res.json({
      success: true,
      message: "Attendance deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
