
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
      .getAll(
        debouncedSearch
          ? `?search=${encodeURIComponent(debouncedSearch)}`
          : ""
      )
      .then((response) => {
        if (!active) return;

        setStudents(Array.isArray(response?.students) ? response.students : []);
        setError("");
      })
      .catch((err) => {
        if (!active) return;

        setError(err.message);
        setStudents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  return { students, search, setSearch, loading, error };
}
