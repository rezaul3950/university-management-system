
const Activity = require("../models/Activity");

// Get latest activities
exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create activity log
exports.createActivity = async ({
  action,
  entityType,
  entityName,
  description,
  user,
}) => {
  try {
    await Activity.create({
      action,
      entityType,
      entityName,
      description,
      performedBy: user?._id || user?.id || null,
      performedByName: user?.name || user?.email || "Admin",
    });
  } catch (error) {
    console.error("Activity Log Error:", error.message);
  }
};
