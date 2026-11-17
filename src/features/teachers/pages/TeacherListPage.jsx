
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
};

export default function TeacherListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadTeachers = async () => {
    try {
      setError("");
      const response = await teacherService.getAll();
      setItems(
        Array.isArray(response?.teachers) ? response.teachers : []
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
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        designation: form.designation.trim(),
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (editingId) {
        await teacherService.update(editingId, payload);
      } else {
        await teacherService.create(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await loadTeachers();
    } catch (err) {
      setError(err.message || "Failed to save teacher");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
      department: teacher.department || "",
      designation: teacher.designation || "",
    });

    setEditingId(teacher._id);
    setShowForm(true);
    setError("");
  };

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

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <>
      <PageHeader
        title="Teachers"
        subtitle="Manage all teachers"
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
        {showForm ? "Cancel" : "Add Teacher"}
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
            name="name"
            placeholder="Teacher Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
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
            minLength={6}
            required={!editingId}
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
          />

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Teacher"
                : "Save Teacher"}
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
        <TeacherTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
