
import Table from "@/components/ui/Table";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onView,
}) {
  const columns = [
    {
      key: "studentId",
      header: "Student ID",
    },
    {
      key: "name",
      header: "Student Name",
    },
    {
      key: "department",
      header: "Department",
    },
    {
      key: "semester",
      header: "Semester",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => onView(row)}
            style={buttonStyle("#2563eb")}
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(row)}
            style={buttonStyle("#d97706")}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(row._id)}
            style={buttonStyle("#dc2626")}
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

const buttonStyle = (backgroundColor) => ({
  padding: "6px 12px",
  borderRadius: "6px",
  backgroundColor,
  color: "#ffffff",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
});
