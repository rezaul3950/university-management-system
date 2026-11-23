
const Department = require("../models/Department");
const { createActivity } = require("./activityController");

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.json({ success: true, department });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Department name and code are required",
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      status,
    });

    await createActivity({
      action: "created",
      entityType: "Department",
      entityName: department.name,
      description: `Department "${department.name}" was created`,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message:
        error.code === 11000
          ? "Department name or code already exists"
          : error.message,
    });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await createActivity({
      action: "updated",
      entityType: "Department",
      entityName: department.name,
      description: `Department "${department.name}" was updated`,
      user: req.user,
    });

    res.json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await createActivity({
      action: "deleted",
      entityType: "Department",
      entityName: department.name,
      description: `Department "${department.name}" was deleted`,
      user: req.user,
    });

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
