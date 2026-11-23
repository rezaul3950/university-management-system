
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import TeacherTable from "../components/TeacherTable";
import { teacherService } from "../services/teacherService";

const initialForm = {
  name: "",
  email: "",
  password: "",
  department: "",
  designation: "",
  status: "active",
};

export default function TeacherListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load Teachers
  const loadTeachers = async () => {
    try {
      setError("");

      const response = await teacherService.getAll();

      setItems(
        Array.isArray(response?.teachers)
          ? response.teachers
          : []
      );
    } catch (err) {
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Statistics
  const totalTeachers = items.length;

  const activeTeachers = items.filter(
    (teacher) => teacher.status !== "inactive"
  ).length;

  const inactiveTeachers = items.filter(
    (teacher) => teacher.status === "inactive"
  ).length;

  // Search and Filter
  const filteredTeachers = items.filter((teacher) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (teacher.name || "").toLowerCase().includes(search) ||
      (teacher.email || "").toLowerCase().includes(search) ||
      (teacher.department || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        teacher.status !== "inactive") ||
      (statusFilter === "inactive" &&
        teacher.status === "inactive");

    return matchesSearch && matchesStatus;
  });

  // Form Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        designation: form.designation.trim(),
        status: form.status,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (editingId) {
        await teacherService.update(editingId, payload);
      } else {
        payload.password = form.password;
        await teacherService.create(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      setViewingTeacher(null);

      await loadTeachers();
    } catch (err) {
      setError(err.message || "Failed to save teacher");
    } finally {
      setSaving(false);
    }
  };

  // View Teacher
  const handleView = (teacher) => {
    setViewingTeacher(teacher);
  };

  // Edit Teacher
  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
      department: teacher.department || "",
      designation: teacher.designation || "",
      status: teacher.status || "active",
    });

    setEditingId(teacher._id);
    setShowForm(true);
    setViewingTeacher(null);
    setError("");
  };

  // Delete Teacher
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await teacherService.remove(id);
      await loadTeachers();
    } catch (err) {
      setError(err.message || "Failed to delete teacher");
    }
  };

  // Cancel Form
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Card Style
  const cardStyle = {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "var(--color-card, #ffffff)",
    border: "1px solid var(--color-border, #e5e7eb)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    flex: "1",
    minWidth: "160px",
  };

  // Input Style
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--color-border, #d1d5db)",
    borderRadius: "7px",
    fontSize: "14px",
    backgroundColor: "var(--color-card, #ffffff)",
  };

  // Primary Button
  const primaryButton = {
    padding: "10px 18px",
    borderRadius: "7px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  };

  // Secondary Button
  const secondaryButton = {
    padding: "10px 16px",
    borderRadius: "7px",
    backgroundColor: "#64748b",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
  };

  return (
    <>
      <PageHeader
        title="Teachers"
        subtitle="Manage all university teachers"
      />

      {/* Statistics */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <p style={{ color: "#64748b", margin: 0 }}>
            Total Teachers
          </p>
          <h2 style={{ fontSize: "28px", margin: "10px 0 0" }}>
            {totalTeachers}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#15803d", margin: 0 }}>
            Active Teachers
          </p>
          <h2
            style={{
              fontSize: "28px",
              color: "#15803d",
              margin: "10px 0 0",
            }}
          >
            {activeTeachers}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#b91c1c", margin: 0 }}>
            Inactive Teachers
          </p>
          <h2
            style={{
              fontSize: "28px",
              color: "#b91c1c",
              margin: "10px 0 0",
            }}
          >
            {inactiveTeachers}
          </h2>
        </div>
      </div>

      {/* Add Teacher Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          type="button"
          style={primaryButton}
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setForm(initialForm);
              setEditingId(null);
              setShowForm(true);
              setViewingTeacher(null);
              setError("");
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Teacher"}
        </button>
      </div>

      {/* Teacher Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "14px",
            maxWidth: "500px",
            padding: "22px",
            marginBottom: "25px",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: "12px",
            backgroundColor: "var(--color-card, #ffffff)",
          }}
        >
          <h3 style={{ margin: "0 0 8px" }}>
            {editingId ? "Edit Teacher" : "Add New Teacher"}
          </h3>

          <input
            name="name"
            placeholder="Teacher Name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="password"
            type="password"
            placeholder={
              editingId
                ? "New Password (optional)"
                : "Password (minimum 6 characters)"
            }
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            minLength={6}
            required={!editingId}
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={saving}
              style={primaryButton}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Teacher"
                  : "Save Teacher"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={secondaryButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: "var(--color-danger, #dc2626)" }}>
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
          placeholder="Search by name, email or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...inputStyle,
            flex: "1",
            minWidth: "220px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            ...inputStyle,
            width: "180px",
          }}
        >
          <option value="all">All Teachers</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          style={secondaryButton}
        >
          Clear Filters
        </button>
      </div>

      {/* Teacher Table */}
      {loading ? (
        <Loader />
      ) : (
        <TeacherTable
          items={filteredTeachers}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Teacher Details Modal */}
      {viewingTeacher && (
        <div
          onClick={() => setViewingTeacher(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "28px",
              borderRadius: "14px",
              backgroundColor: "var(--color-card, #ffffff)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0 }}>Teacher Details</h2>

              <button
                type="button"
                onClick={() => setViewingTeacher(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <p>
              <strong>Name:</strong> {viewingTeacher.name}
            </p>
            <p>
              <strong>Email:</strong> {viewingTeacher.email}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {viewingTeacher.department || "—"}
            </p>
            <p>
              <strong>Designation:</strong>{" "}
              {viewingTeacher.designation || "—"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {viewingTeacher.status || "active"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {viewingTeacher.createdAt
                ? new Date(viewingTeacher.createdAt).toLocaleDateString()
                : "—"}
            </p>

            <button
              type="button"
              onClick={() => setViewingTeacher(null)}
              style={{
                padding: "10px 20px",
                borderRadius: "7px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "10px",
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
