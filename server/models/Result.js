
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
