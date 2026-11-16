import Table from "@/components/ui/Table";

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "department", header: "Department" },
  { key: "designation", header: "Designation" },
];

export default function TeacherTable({ items }) {
  return <Table columns={columns} data={items} emptyText="No teachers found" />;
}