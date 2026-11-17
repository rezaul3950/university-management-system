
import Table from "@/components/ui/Table";

export default function TeacherTable({ items, onEdit, onDelete }) {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "department",
      header: "Department",
    },
    {
      key: "designation",
      header: "Designation",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onEdit(row)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(row._id)}
            style={{ color: "red" }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      emptyText="No teachers found"
    />
  );
}
