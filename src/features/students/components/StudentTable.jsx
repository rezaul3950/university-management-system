
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

export default function StudentTable({ students, onEdit, onDelete }) {
  const columns = [
    { key: "studentId", header: "ID" },
    { key: "name", header: "Name" },
    { key: "department", header: "Department" },
    { key: "semester", header: "Semester" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={row.status === "active" ? "success" : "warning"}>
          {row.status || "active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" onClick={() => onEdit(row)}>
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
      data={students}
      emptyText="No students found"
    />
  );
}
