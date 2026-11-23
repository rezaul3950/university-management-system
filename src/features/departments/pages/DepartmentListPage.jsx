
import { useEffect, useState } from "react";
import { departmentService } from "../services/departmentService";
import DepartmentTable from "../components/DepartmentTable";

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Search, Filter and View States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingDepartment, setViewingDepartment] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "active",
  });

  // Fetch Departments
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
   // Department Statistics
      const totalDepartments = departments.length;

      const activeDepartments = departments.filter(
   (department) => department.status === "active"
    ).length;

    const inactiveDepartments = departments.filter(
  (department) => department.status === "inactive"
    ).length;

  // Search and Filter Logic
  const filteredDepartments = departments.filter((department) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      department.name?.toLowerCase().includes(search) ||
      department.code?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      department.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Form Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset Form
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

  // Add and Update Department
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDepartment) {
        await departmentService.update(
          editingDepartment._id,
          formData
        );
        alert("Department updated successfully");
      } else {
        await departmentService.create(formData);
        alert("Department created successfully");
      }

      resetForm();
      await fetchDepartments();
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  // Edit Department
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

  // Delete Department
  const handleDelete = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) return;

    try {
      await departmentService.remove(department._id);
      alert("Department deleted successfully");
      await fetchDepartments();
    } catch (error) {
      alert(error.message || "Failed to delete department");
    }
  };

  // View Department Details
  const handleView = (department) => {
    setViewingDepartment(department);
  };

  return (
    <div className="space-y-6">
      {/* Department Statistics */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">

  {/* Total Departments */}
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Total Departments
    </p>
    <h2 className="mt-2 text-3xl font-bold text-blue-600">
      {totalDepartments}
    </h2>
  </div>

  {/* Active Departments */}
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Active Departments
    </p>
    <h2 className="mt-2 text-3xl font-bold text-green-600">
      {activeDepartments}
    </h2>
  </div>

  {/* Inactive Departments */}
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      Inactive Departments
    </p>
    <h2 className="mt-2 text-3xl font-bold text-red-600">
      {inactiveDepartments}
    </h2>
  </div>

</div>
      {/* Department Details Popup */}
      {viewingDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Department Details
              </h2>

              <button
                onClick={() => setViewingDepartment(null)}
                className="text-2xl text-gray-500 hover:text-black"
                aria-label="Close details"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Department Name
                </p>
                <p className="font-semibold">
                  {viewingDepartment.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Department Code
                </p>
                <p className="font-semibold">
                  {viewingDepartment.code}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Description
                </p>
                <p className="font-semibold">
                  {viewingDepartment.description || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>
                <span
                  className={
                    viewingDepartment.status === "active"
                      ? "font-semibold text-green-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {viewingDepartment.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Created Date
                </p>
                <p className="font-semibold">
                  {viewingDepartment.createdAt
                    ? new Date(
                        viewingDepartment.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Last Updated
                </p>
                <p className="font-semibold">
                  {viewingDepartment.updatedAt
                    ? new Date(
                        viewingDepartment.updatedAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

            </div>

            <button
              onClick={() => setViewingDepartment(null)}
              className="mt-6 w-full rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Departments
          </h1>
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

      {/* Add and Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border bg-white p-5"
        >
          <h2 className="text-lg font-semibold">
            {editingDepartment
              ? "Edit Department"
              : "Add New Department"}
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

      {/* Search and Filter */}
      <div className="rounded-lg border bg-white p-5">

        <h2 className="mb-4 text-lg font-semibold">
          Department Search & Filter
        </h2>

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div>
            <label className="mb-1 block text-sm font-medium">
              Search Department
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Filter by Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="all">All Departments</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

        </div>

        {/* Department Table */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <h2 className="text-lg font-semibold">
            All Departments ({filteredDepartments.length})
          </h2>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="rounded border px-3 py-2 hover:bg-gray-100"
          >
            Clear Filters
          </button>

        </div>

        {loading ? (
          <p>Loading departments...</p>
        ) : filteredDepartments.length === 0 ? (
          <p className="rounded bg-gray-50 p-4 text-gray-500">
            No departments found.
          </p>
        ) : (
          <DepartmentTable
            items={filteredDepartments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}

      </div>
    </div>
  );
}
