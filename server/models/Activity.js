
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["created", "updated", "deleted"],
      required: true,
    },
    entityType: {
      type: String,
      enum: ["Student", "Teacher", "Course", "Department"],
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    performedByName: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
