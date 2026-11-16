
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import Table from "@/components/ui/Table";
import { resultService } from "../services/resultService";

const initialForm = {
  student: "",
  course: "",
  marks: "",
  grade: "",
};

export default function ResultsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadResults = async () => {
    try {
      setError("");
      const response = await resultService.getAll();
      setItems(response?.data?.data ?? response?.data ?? response ?? []);
    } catch (err) {
      setError(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
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
        marks: Number(form.marks),
      };

      if (editingId) {
        await resultService.update(editingId, payload);
      } else {
        await resultService.create(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await loadResults();
    } catch (err) {
      setError(err.message || "Failed to save result");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      student: item.student || "",
      course: item.course || "",
      marks: String(item.marks ?? ""),
      grade: item.grade || "",
    });

    setEditingId(item._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) {
      return;
    }

    try {
      setError("");
      await resultService.remove(id);
      await loadResults();
    } catch (err) {
      setError(err.message || "Failed to delete result");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const columns = [
    { key: "student", header: "Student" },
    { key: "course", header: "Course" },
    { key: "marks", header: "Marks" },
    { key: "grade", header: "Grade" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => handleEdit(row)}>
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            style={{ color: "red" }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Results" subtitle="Exam results" />

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
        style={{ marginBottom: 20, padding: "10px 18px" }}
      >
        {showForm ? "Cancel" : "Add Result"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 12,
            maxWidth: 400,
            marginBottom: 25,
          }}
        >
          <input
            name="student"
            placeholder="Student Name"
            value={form.student}
            onChange={handleChange}
            required
          />

          <input
            name="course"
            placeholder="Course Code (e.g. CSE101)"
            value={form.course}
            onChange={handleChange}
            required
          />

          <input
            name="marks"
            type="number"
            placeholder="Marks"
            value={form.marks}
            onChange={handleChange}
            min="0"
            required
          />

          <input
            name="grade"
            placeholder="Grade (e.g. A+)"
            value={form.grade}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Result"
                : "Save Result"}
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}

      {error && (
        <p style={{ color: "var(--color-danger)" }}>{error}</p>
      )}

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={items}
          emptyText="No records found"
        />
      )}
    </>
  );
}
