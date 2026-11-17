
import { useEffect, useState } from "react";
import { departmentService } from "../services/departmentService";
import DepartmentTable from "../components/DepartmentTable";

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "active",
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAll();
      setDepartments(response.departments || []);
    } catch (error) {
      alert(error.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      status: "active",
    });
    setEditingDepartment(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDepartment) {
        await departmentService.update(editingDepartment._id, formData);
        alert("Department updated successfully");
      } else {
        await departmentService.create(formData);
        alert("Department created successfully");
      }

      resetForm();
      fetchDepartments();
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || "",
      code: department.code || "",
      description: department.description || "",
      status: department.status || "active",
    });
    setShowForm(true);
  };

  const handleDelete = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) return;

    try {
      await departmentService.remove(department._id);
      alert("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      alert(error.message || "Failed to delete department");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-gray-500">
            Manage university departments
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border bg-white p-5"
        >
          <h2 className="text-lg font-semibold">
            {editingDepartment ? "Edit Department" : "Add New Department"}
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Department Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Computer Science and Engineering"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Department Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="CSE"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Department description"
              rows="3"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {editingDepartment ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded border px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">
          All Departments ({departments.length})
        </h2>

        {loading ? (
          <p>Loading departments...</p>
        ) : (
          <DepartmentTable
            items={departments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
