
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import Loader from "@/components/ui/Loader";
import StudentTable from "../components/StudentTable";
import { useStudents } from "../hooks/useStudents";
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
  const { students, search, setSearch, loading, error } = useStudents();

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const payload = { ...form };

      if (editingId && !payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await studentService.update(editingId, payload);
      } else {
        await studentService.create(payload);
      }

      window.location.reload();
    } catch (err) {
      setFormError(err.message || "Failed to save student");
    } finally {
      setSaving(false);
    }
  };

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
    setFormError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await studentService.remove(id);
      window.location.reload();
    } catch (err) {
      setFormError(err.message || "Failed to delete student");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  };

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage all students"
        action={
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search students..."
          />
        }
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
        style={{ marginBottom: "20px", padding: "10px 18px" }}
      >
        {showForm ? "Cancel" : "Add Student"}
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
            name="studentId"
            placeholder="Student ID"
            value={form.studentId}
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Student Name"
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
            placeholder={editingId ? "New Password (optional)" : "Password"}
            value={form.password}
            onChange={handleChange}
            required={!editingId}
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            name="semester"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {formError && (
            <p style={{ color: "var(--color-danger)" }}>{formError}</p>
          )}

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Student"
                : "Save Student"}
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
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
