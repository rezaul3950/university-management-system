import { useEffect, useState } from "react";
import { studentService } from "../services/studentService";
import { useDebounce } from "@/hooks/useDebounce";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    let active = true;
    setLoading(true);
    studentService
      .getAll(debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "")
      .then((data) => active && (setStudents(data?.data ?? data ?? []), setError("")))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  return { students, search, setSearch, loading, error };
}