
const Result = require("../models/Result");

// Get all results
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get result by ID
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create result
exports.createResult = async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update result
exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
