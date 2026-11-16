import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

const columns = [
  { key: "studentId", header: "ID" },
  { key: "name", header: "Name" },
  { key: "department", header: "Department" },
  { key: "semester", header: "Semester" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge tone={row.status === "active" ? "success" : "warning"}>{row.status || "active"}</Badge>
    ),
  },
];

export default function StudentTable({ students }) {
  return <Table columns={columns} data={students} emptyText="No students found" />;
}