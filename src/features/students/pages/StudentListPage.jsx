import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import Loader from "@/components/ui/Loader";
import StudentTable from "../components/StudentTable";
import { useStudents } from "../hooks/useStudents";

export default function StudentListPage() {
  const { students, search, setSearch, loading, error } = useStudents();

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Manage all students"
        action={<SearchBar value={search} onChange={setSearch} placeholder="Search students..." />}
      />
      {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}
      {loading ? <Loader /> : <StudentTable students={students} />}
    </>
  );
}