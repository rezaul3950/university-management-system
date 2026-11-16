
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
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
