
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import { departmentService } from "../services/departmentService";
import DepartmentTable from "../components/DepartmentTable";

const initialForm = {
  name: "",
  code: "",
  description: "",
  status: "active",
};

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [viewingDepartment, setViewingDepartment] = useState(null);
  const [error, setError] = useState("");

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form State
  const [formData, setFormData] = useState(initialForm);

  // Load Departments
  const fetchDepartments = async () => {
    try {
      setError("");
      const response = await departmentService.getAll();
      setDepartments(response?.departments || []);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Department Statistics
  const totalDepartments = departments.length;

  const activeDepartments = departments.filter(
    (department) => (department.status || "active") === "active"
  ).length;

  const inactiveDepartments = departments.filter(
    (department) => department.status === "inactive"
  ).length;

  // Search and Filter Logic
  const filteredDepartments = departments.filter((department) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      department.name?.toLowerCase().includes(search) ||
      department.code?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (department.status || "active") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset Form
  const resetForm = () => {
    setFormData(initialForm);
    setEditingDepartment(null);
    setShowForm(false);
    setError("");
  };

  // Add or Update Department
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingDepartment) {
        await departmentService.update(
          editingDepartment._id,
          formData
        );
      } else {
        await departmentService.create(formData);
      }

      resetForm();
      await fetchDepartments();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Edit Department
  const handleEdit = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department.name || "",
      code: department.code || "",
      description: department.description || "",
      status: department.status || "active",
    });

    setShowForm(true);
    setError("");
  };

  // Delete Department
  const handleDelete = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await departmentService.remove(department._id);
      await fetchDepartments();
    } catch (err) {
      setError(err.message || "Failed to delete department");
    }
  };

  // View Department Details
  const handleView = (department) => {
    setViewingDepartment(department);
  };

  // Clear Filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Manage university departments"
      />

      {/* Department Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Departments</h3>
          <h2>{totalDepartments}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Active Departments</h3>
          <h2 style={{ color: "green" }}>
            {activeDepartments}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Inactive Departments</h3>
          <h2 style={{ color: "red" }}>
            {inactiveDepartments}
          </h2>
        </div>
      </div>

      {/* Add Department Button */}
      <button
        type="button"
        onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setFormData(initialForm);
            setEditingDepartment(null);
            setShowForm(true);
          }
        }}
        style={{
          marginBottom: "20px",
          padding: "10px 18px",
        }}
      >
        {showForm ? "Cancel" : "Add Department"}
      </button>

      {/* Department Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "12px",
            maxWidth: "400px",
            marginBottom: "25px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Department Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="code"
            placeholder="Department Code"
            value={formData.code}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Department Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingDepartment
                ? "Update Department"
                : "Save Department"}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <p style={{ color: "var(--color-danger)" }}>
          {error}
        </p>
      )}

      {/* Search and Filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            minWidth: "250px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="button"
          onClick={handleClearFilters}
          style={{ padding: "10px 16px" }}
        >
          Clear Filters
        </button>
      </div>

      {/* Department Table */}
      <h3 style={{ marginBottom: "15px" }}>
        All Departments ({filteredDepartments.length})
      </h3>

      {loading ? (
        <Loader />
      ) : (
        <DepartmentTable
          items={filteredDepartments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Department Details Popup */}
      {viewingDepartment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              color: "#222",
              padding: "25px",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>
              Department Details
            </h2>

            <p><strong>Name:</strong> {viewingDepartment.name}</p>
            <p><strong>Code:</strong> {viewingDepartment.code}</p>
            <p>
              <strong>Description:</strong>{" "}
              {viewingDepartment.description || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {viewingDepartment.status || "active"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {viewingDepartment.createdAt
                ? new Date(viewingDepartment.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {viewingDepartment.updatedAt
                ? new Date(viewingDepartment.updatedAt).toLocaleDateString()
                : "N/A"}
            </p>

            <button
              type="button"
              onClick={() => setViewingDepartment(null)}
              style={{
                marginTop: "20px",
                padding: "10px 18px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const cardStyle = {
  padding: "18px",
  borderRadius: "10px",
  border: "1px solid var(--color-border, #ddd)",
  backgroundColor: "var(--color-card, white)",
};
