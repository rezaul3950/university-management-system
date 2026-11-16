
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import Table from "@/components/ui/Table";
import { noticeService } from "../services/noticeService";

const initialForm = {
  title: "",
  postedBy: "",
  date: "",
};

export default function NoticesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadNotices = async () => {
    try {
      setError("");
      const response = await noticeService.getAll();
      setItems(response?.data?.data ?? response?.data ?? response ?? []);
    } catch (err) {
      setError(err.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
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
        await noticeService.update(editingId, form);
      } else {
        await noticeService.create(form);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await loadNotices();
    } catch (err) {
      setError(err.message || "Failed to save notice");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      postedBy: item.postedBy || "",
      date: item.date || "",
    });

    setEditingId(item._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      setError("");
      await noticeService.remove(id);
      await loadNotices();
    } catch (err) {
      setError(err.message || "Failed to delete notice");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "postedBy", header: "Posted By" },
    { key: "date", header: "Date" },
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
      <PageHeader
        title="Notices"
        subtitle="Latest announcements"
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
        style={{ marginBottom: 20, padding: "10px 18px" }}
      >
        {showForm ? "Cancel" : "Add Notice"}
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
            name="title"
            placeholder="Notice Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="postedBy"
            placeholder="Posted By"
            value={form.postedBy}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Notice"
                : "Save Notice"}
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
