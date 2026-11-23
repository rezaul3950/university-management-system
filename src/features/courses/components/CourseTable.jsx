
import Table from "@/components/ui/Table";

export default function CourseTable({ items, onEdit, onDelete }) {
  const columns = [
    {
      key: "code",
      header: "Code",
    },
    {
      key: "title",
      header: "Title",
    },
    {
      key: "credit",
      header: "Credit",
    },
    {
      key: "department",
      header: "Department",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor:
              row.status === "inactive" ? "#fee2e2" : "#dcfce7",
            color:
              row.status === "inactive" ? "#b91c1c" : "#15803d",
          }}
        >
          {row.status || "active"}
        </span>
      ),
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
      emptyText="No courses found"
    />
  );
}
