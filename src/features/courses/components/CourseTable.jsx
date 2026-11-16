
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
