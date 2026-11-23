
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import CourseTable from "../components/CourseTable";
import { courseService } from "../services/courseService";

const initialForm = {
  code: "",
  title: "",
  credit: "",
  department: "",
  status: "active",
};

export default function CourseListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load Courses
  const loadCourses = async () => {
    try {
      setError("");
      const response = await courseService.getAll();
      setItems(response?.data?.data ?? response?.data ?? response ?? []);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Course Statistics
  const totalCourses = items.length;

  const activeCourses = items.filter(
    (course) => (course.status || "active") === "active"
  ).length;

  const inactiveCourses = items.filter(
    (course) => course.status === "inactive"
  ).length;

  // Search and Filter Logic
  const filteredCourses = items.filter((course) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      course.code?.toLowerCase().includes(search) ||
      course.title?.toLowerCase().includes(search) ||
      course.department?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (course.status || "active") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Form Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        credit: Number(form.credit),
      };

      if (editingId) {
        await courseService.update(editingId, payload);
      } else {
        await courseService.create(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await loadCourses();
    } catch (err) {
      setError(err.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Edit Course
  const handleEdit = (course) => {
    setForm({
      code: course.code || "",
      title: course.title || "",
      credit: String(course.credit ?? ""),
      department: course.department || "",
      status: course.status || "active",
    });

    setEditingId(course._id);
    setShowForm(true);
    setError("");
  };

  // Delete Course
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await courseService.remove(id);
      await loadCourses();
    } catch (err) {
      setError(err.message || "Failed to delete course");
    }
  };

  // Cancel Form
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // Clear Search and Filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle="All available courses"
      />

      {/* Course Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Courses</h3>
          <h2>{totalCourses}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Active Courses</h3>
          <h2 style={{ color: "green" }}>{activeCourses}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Inactive Courses</h3>
          <h2 style={{ color: "red" }}>{inactiveCourses}</h2>
        </div>
      </div>

      {/* Add Course Button */}
      <button
        type="button"
        onClick={() => {
          if (showForm) {
            handleCancel();
          } else {
            setForm(initialForm);
            setEditingId(null);
            setShowForm(true);
          }
        }}
        style={{
          marginBottom: "20px",
          padding: "10px 18px",
        }}
      >
        {showForm ? "Cancel" : "Add Course"}
      </button>

      {/* Course Form */}
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
            name="code"
            placeholder="Course Code"
            value={form.code}
            onChange={handleChange}
            required
          />

          <input
            name="title"
            placeholder="Course Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="credit"
            type="number"
            placeholder="Credit"
            value={form.credit}
            onChange={handleChange}
            min="0"
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Course"
                : "Save Course"}
          </button>

          <button type="button" onClick={handleCancel}>
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
          placeholder="Search by code, title or department..."
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

      {/* Course Table */}
      {loading ? (
        <Loader />
      ) : (
        <CourseTable
          items={filteredCourses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
