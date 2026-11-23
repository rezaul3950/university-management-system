
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import StudentTable from "../components/StudentTable";
import { studentService } from "../services/studentService";

const initialForm = {
  studentId: "",
  name: "",
  email: "",
  password: "",
  department: "",
  semester: "",
  status: "active",
};

export default function StudentListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load Students
  const loadStudents = async () => {
    try {
      setError("");

      const response = await studentService.getAll();

      setItems(
        Array.isArray(response?.students)
          ? response.students
          : []
      );
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Statistics
  const totalStudents = items.length;

  const activeStudents = items.filter(
    (student) => student.status !== "inactive"
  ).length;

  const inactiveStudents = items.filter(
    (student) => student.status === "inactive"
  ).length;

  // Search and Filter
  const filteredStudents = items.filter((student) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (student.studentId || "").toLowerCase().includes(search) ||
      (student.name || "").toLowerCase().includes(search) ||
      (student.email || "").toLowerCase().includes(search) ||
      (student.department || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        student.status !== "inactive") ||
      (statusFilter === "inactive" &&
        student.status === "inactive");

    return matchesSearch && matchesStatus;
  });

  // Form Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        studentId: form.studentId.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        semester: form.semester.trim(),
        status: form.status,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (editingId) {
        await studentService.update(editingId, payload);
      } else {
        payload.password = form.password;
        await studentService.create(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      setViewingStudent(null);

      await loadStudents();
    } catch (err) {
      setError(err.message || "Failed to save student");
    } finally {
      setSaving(false);
    }
  };

  // Edit Student
  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId || "",
      name: student.name || "",
      email: student.email || "",
      password: "",
      department: student.department || "",
      semester: student.semester || "",
      status: student.status || "active",
    });

    setEditingId(student._id);
    setShowForm(true);
    setViewingStudent(null);
    setError("");
  };

  // Delete Student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await studentService.remove(id);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Failed to delete student");
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
        title="Students"
        subtitle="Manage all university students"
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
            Total Students
          </p>
          <h2 style={{ fontSize: "28px", margin: "10px 0 0" }}>
            {totalStudents}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#15803d", margin: 0 }}>
            Active Students
          </p>
          <h2
            style={{
              fontSize: "28px",
              color: "#15803d",
              margin: "10px 0 0",
            }}
          >
            {activeStudents}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#b91c1c", margin: 0 }}>
            Inactive Students
          </p>
          <h2
            style={{
              fontSize: "28px",
              color: "#b91c1c",
              margin: "10px 0 0",
            }}
          >
            {inactiveStudents}
          </h2>
        </div>
      </div>

      {/* Add Student Button */}
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
              setViewingStudent(null);
              setError("");
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Student"}
        </button>
      </div>

      {/* Student Form */}
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
            {editingId ? "Edit Student" : "Add New Student"}
          </h3>

          <input
            name="studentId"
            placeholder="Student ID"
            value={form.studentId}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="name"
            placeholder="Student Name"
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
            required
          />

          <input
            name="semester"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
            style={inputStyle}
            required
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
                  ? "Update Student"
                  : "Save Student"}
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
          placeholder="Search by ID, name, email or department..."
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
          <option value="all">All Students</option>
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

      {/* Student Table */}
      {loading ? (
        <Loader />
      ) : (
        <StudentTable
          students={filteredStudents}
          onView={setViewingStudent}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Student Details Modal */}
      {viewingStudent && (
        <div
          onClick={() => setViewingStudent(null)}
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
              <h2 style={{ margin: 0 }}>Student Details</h2>

              <button
                type="button"
                onClick={() => setViewingStudent(null)}
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
              <strong>Student ID:</strong>{" "}
              {viewingStudent.studentId || "—"}
            </p>
            <p>
              <strong>Name:</strong> {viewingStudent.name}
            </p>
            <p>
              <strong>Email:</strong> {viewingStudent.email}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {viewingStudent.department || "—"}
            </p>
            <p>
              <strong>Semester:</strong>{" "}
              {viewingStudent.semester || "—"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {viewingStudent.status || "active"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {viewingStudent.createdAt
                ? new Date(viewingStudent.createdAt).toLocaleDateString()
                : "—"}
            </p>

            <button
              type="button"
              onClick={() => setViewingStudent(null)}
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
