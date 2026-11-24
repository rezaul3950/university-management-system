
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    student: {
      type: String,
      required: true,
      trim: true,
    },
    studentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    studentId: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    teacherName: {
      type: String,
      trim: true,
      default: "",
    },
    recordedByRole: {
      type: String,
      enum: ["admin", "teacher", "student", ""],
      default: "",
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
