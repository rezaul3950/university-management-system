import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Loader from "@/components/ui/Loader";
import TeacherTable from "../components/TeacherTable";
import { teacherService } from "../services/teacherService";

export default function TeacherListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    teacherService
      .getAll()
      .then((data) => active && setItems(data?.data ?? data ?? []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title="Teachers" subtitle="Manage all teachers" />
      {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}
      {loading ? <Loader /> : <TeacherTable items={items} />}
    </>
  );
}