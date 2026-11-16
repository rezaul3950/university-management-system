
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import Table from "@/components/ui/Table";
import { attendanceService } from "../services/attendanceService";

const initialForm = {
  date: "",
  course: "",
  student: "",
  status: "Present",
};

export default function AttendancePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadAttendance = async () => {
    try {
      setError("");
      const response = await attendanceService.getAll();
      setItems(response?.data?.data ?? response?.data ?? response ?? []);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
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
      if (editingId) {
        await attendanceService.update(editingId, form);
      } else {
        await attendanceService.create(form);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await loadAttendance();
    } catch (err) {
      setError(err.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      date: item.date || "",
      course: item.course || "",
      student: item.student || "",
      status: item.status || "Present",
    });

    setEditingId(item._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      setError("");
      await attendanceService.remove(id);
      await loadAttendance();
    } catch (err) {
      setError(err.message || "Failed to delete attendance");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const columns = [
    { key: "date", header: "Date" },
    { key: "course", header: "Course" },
    { key: "student", header: "Student" },
    { key: "status", header: "Status" },
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
      <PageHeader title="Attendance" subtitle="Attendance records" />

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
        {showForm ? "Cancel" : "Add Attendance"}
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
            type="date"
            name="date"
            value={form.date}
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
            name="student"
            placeholder="Student Name"
            value={form.student}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Attendance"
                : "Save Attendance"}
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
