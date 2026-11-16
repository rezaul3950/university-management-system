
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
};

export default function CourseListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleEdit = (course) => {
    setForm({
      code: course.code || "",
      title: course.title || "",
      credit: String(course.credit ?? ""),
      department: course.department || "",
    });

    setEditingId(course._id);
    setShowForm(true);
    setError("");
  };

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

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle="All available courses"
      />

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

      {error && (
        <p style={{ color: "var(--color-danger)" }}>
          {error}
        </p>
      )}

      {loading ? (
        <Loader />
      ) : (
        <CourseTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
