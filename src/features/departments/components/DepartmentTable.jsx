
import Table from "@/components/ui/Table";

export default function DepartmentTable({
  items,
  onEdit,
  onDelete,
  onView,
}) {
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
          style={{
            display: "inline-block",
            padding: "5px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor:
              item.status === "inactive" ? "#fee2e2" : "#dcfce7",
            color:
              item.status === "inactive" ? "#b91c1c" : "#15803d",
          }}
        >
          {item.status || "active"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onView(item)}
            style={buttonStyle("#2563eb", "#1d4ed8")}
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(item)}
            style={buttonStyle("#d97706", "#b45309")}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            style={buttonStyle("#dc2626", "#b91c1c")}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={items} />;
}

const buttonStyle = (backgroundColor, hoverColor) => ({
  padding: "6px 12px",
  borderRadius: "6px",
  backgroundColor,
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
});
