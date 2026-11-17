
import Table from "@/components/ui/Table";

export default function DepartmentTable({ items, onEdit, onDelete }) {
  const columns = [
    {
      key: "name",
      header: "Department Name",
    },
    {
      key: "code",
      header: "Department Code",
    },
    {
      key: "description",
      header: "Description",
      render: (item) => item.description || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={
            item.status === "active"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(item)}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={items} />;
}
