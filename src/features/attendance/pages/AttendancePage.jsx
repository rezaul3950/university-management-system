
import { useEffect, useMemo, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import { studentService } from "@/features/students/services/studentService";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialForm = {
  date: getToday(),
  course: "",
};

function getStudents(response) {
  if (Array.isArray(response?.students)) return response.students;
  if (Array.isArray(response?.data?.students)) return response.data.students;
  return [];
}

function getAttendance(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response)) return response;
  return [];
}

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentResponse, attendanceResponse] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
      ]);

      const studentList = getStudents(studentResponse);
      const attendanceList = getAttendance(attendanceResponse);

      setStudents(
        studentList.filter((student) => student.status !== "inactive")
      );

      setRecords(attendanceList);
    } catch (err) {
      console.error("Attendance loading error:", err);
      setError(err.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load previously saved statuses for the selected date and course.
  useEffect(() => {
    const existing = {};

    records.forEach((record) => {
      if (
        record.date === form.date &&
        record.course?.toLowerCase() === form.course.trim().toLowerCase()
      ) {
        const studentId =
          record.studentRef?._id || record.studentRef;

        if (studentId) {
          existing[String(studentId)] = record.status;
        }
      }
    });

    setStatuses((previous) => ({
      ...Object.fromEntries(
        students.map((student) => [
          String(student._id),
          "Present",
        ])
      ),
      ...existing,
    }));
  }, [students, records, form.date, form.course]);

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase();

    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(keyword) ||
        student.studentId?.toLowerCase().includes(keyword) ||
        student.department?.toLowerCase().includes(keyword)
    );
  }, [students, search]);

  const presentCount = Object.values(statuses).filter(
    (status) => status === "Present"
  ).length;

  const absentCount = Object.values(statuses).filter(
    (status) => status === "Absent"
  ).length;

  const lateCount = Object.values(statuses).filter(
    (status) => status === "Late"
  ).length;

  const totalRecords = records.length;

  const setAllStatus = (status) => {
    const updated = {};
    students.forEach((student) => {
      updated[String(student._id)] = status;
    });
    setStatuses(updated);
  };

  const changeStatus = (studentId, status) => {
    setStatuses((previous) => ({
      ...previous,
      [String(studentId)]: status,
    }));
  };

  const handleBulkSave = async () => {
    if (!form.date || !form.course.trim()) {
      alert("Please select date and enter course.");
      return;
    }

    if (students.length === 0) {
      alert("No students found.");
      return;
    }

    if (
      !window.confirm(
        `Save attendance for ${students.length} students on ${form.date}?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      let successCount = 0;
      let failedCount = 0;

      for (const student of students) {
        const studentId = String(student._id);
        const status = statuses[studentId] || "Present";

        const existingRecord = records.find((record) => {
          const recordStudentId =
            record.studentRef?._id || record.studentRef;

          return (
            String(recordStudentId) === studentId &&
            record.date === form.date &&
            record.course?.toLowerCase() ===
              form.course.trim().toLowerCase()
          );
        });

        const payload = {
          date: form.date,
          course: form.course.trim(),
          studentMongoId: student._id,
          status,
        };

        try {
          if (existingRecord) {
            await attendanceService.update(existingRecord._id, payload);
          } else {
            await attendanceService.create(payload);
          }
          successCount++;
        } catch (err) {
          console.error(
            `Attendance failed for ${student.name}:`,
            err
          );
          failedCount++;
        }
      }

      await loadData();

      if (failedCount === 0) {
        alert(`Successfully saved attendance for ${successCount} students.`);
      } else {
        alert(
          `${successCount} students saved successfully. ${failedCount} failed. Please refresh and check.`
        );
      }
    } catch (err) {
      alert(err.message || "Attendance save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    const studentId = record.studentRef?._id || record.studentRef;

    const student = students.find(
      (item) =>
        String(item._id) === String(studentId) ||
        (item.name === record.student &&
          item.studentId === record.studentId)
    );

    if (!student) {
      alert("Student not found.");
      return;
    }

    setForm({
      date: record.date || getToday(),
      course: record.course || "",
    });

    setStatuses({
      [String(student._id)]: record.status || "Present",
    });

    setEditingId(record._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSingleUpdate = async () => {
    if (!editingId) return;

    const record = records.find(
      (item) => item._id === editingId
    );

    if (!record) return;

    const studentId =
      record.studentRef?._id || record.studentRef;

    const status = statuses[String(studentId)] || "Present";

    try {
      setSaving(true);

      await attendanceService.update(editingId, {
        date: form.date,
        course: form.course.trim(),
        studentMongoId: studentId,
        status,
      });

      alert("Attendance updated successfully.");
      setEditingId(null);
      await loadData();
    } catch (err) {
      alert(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await attendanceService.remove(id);
      alert("Attendance deleted successfully.");
      await loadData();
    } catch (err) {
      alert(err.message || "Delete failed.");
    }
  };

  const sortedRecords = useMemo(
    () =>
      [...records].sort((a, b) =>
        String(b.date || "").localeCompare(String(a.date || ""))
      ),
    [records]
  );

  const card = {
    background: "var(--color-surface, #fff)",
    border: "1px solid var(--color-border, #e5e7eb)",
    borderRadius: 15,
    padding: 20,
    boxShadow: "0 3px 12px rgba(15,23,42,.035)",
  };

  const input = {
    width: "100%",
    padding: "11px 13px",
    border: "1px solid var(--color-border, #d1d5db)",
    borderRadius: 9,
    background: "var(--color-surface, white)",
    color: "var(--color-text, #222)",
    marginTop: 7,
    boxSizing: "border-box",
  };

  const button = {
    padding: "10px 16px",
    border: "none",
    borderRadius: 9,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: 650,
  };

  const statusButton = (active, color, background) => ({
    padding: "7px 10px",
    borderRadius: 7,
    border: `1px solid ${active ? color : "#e2e8f0"}`,
    background: active ? background : "transparent",
    color: active ? color : "#64748b",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 11,
  });

  const statusBadge = (status) => {
    const colors = {
      Present: ["#dcfce7", "#15803d"],
      Absent: ["#fee2e2", "#b91c1c"],
      Late: ["#fef3c7", "#a16207"],
    };

    const [background, color] = colors[status] || colors.Present;

    return {
      background,
      color,
      padding: "5px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
    };
  };

  return (
    <div style={{ padding: "22px", color: "var(--color-text, #172033)" }}>
      <style>{`
        .attendance-grid {
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:15px;
          margin-bottom:22px;
        }
        .attendance-student-row {
          display:grid;
          grid-template-columns:minmax(180px,1fr) auto;
          align-items:center;
          gap:12px;
          padding:14px 12px;
          border-bottom:1px solid #edf0f5;
        }
        .attendance-student-row:last-child {border-bottom:0}
        .attendance-status-actions {
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }
        .attendance-table-wrap {overflow-x:auto}
        .attendance-table {
          width:100%;
          min-width:700px;
          border-collapse:collapse;
        }
        .attendance-table th,.attendance-table td {
          text-align:left;
          padding:13px;
          border-bottom:1px solid #edf0f5;
          font-size:13px;
        }
        .attendance-table th {
          color:#8792a5;
          font-size:11px;
          text-transform:uppercase;
        }
        @media(max-width:750px) {
          .attendance-grid {grid-template-columns:repeat(2,minmax(0,1fr))}
          .attendance-student-row {grid-template-columns:1fr}
          .attendance-status-actions {justify-content:flex-start}
        }
        @media(max-width:450px) {
          .attendance-grid {gap:9px}
        }
      `}</style>

      <div style={{ marginBottom: 23 }}>
        <div
          style={{
            color: "#2563eb",
            fontSize: 12,
            fontWeight: 750,
            letterSpacing: 1,
          }}
        >
          UNIVERSITY MANAGEMENT SYSTEM
        </div>

        <h1 style={{ fontSize: 27, margin: "7px 0" }}>
          Attendance Management
        </h1>

        <p style={{ color: "#8792a5", margin: 0, fontSize: 13 }}>
          Take daily attendance and manage student attendance records.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: 13,
            borderRadius: 9,
            marginBottom: 18,
          }}
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="attendance-grid">
        {[
          ["Total Students", students.length, "👨‍🎓", "#eff6ff", "#2563eb"],
          ["Present", presentCount, "✓", "#dcfce7", "#15803d"],
          ["Absent", absentCount, "✕", "#fee2e2", "#dc2626"],
          ["Late", lateCount, "◷", "#fef3c7", "#a16207"],
        ].map(([label, value, icon, background, color]) => (
          <div style={card} key={label}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 12 }}>
                {label}
              </span>
              <span
                style={{
                  background,
                  color,
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                }}
              >
                {icon}
              </span>
            </div>
            <h2 style={{ fontSize: 27, margin: "12px 0 0" }}>
              {loading ? "..." : value}
            </h2>
          </div>
        ))}
      </div>

      {/* Attendance Form */}
      <section style={{ ...card, marginBottom: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ fontSize: 19, margin: "0 0 5px" }}>
              {editingId ? "Edit Attendance" : "Take Class Attendance"}
            </h2>
            <p style={{ color: "#8792a5", fontSize: 12, margin: 0 }}>
              Select a date and course, then mark each student's status.
            </p>
          </div>

          {editingId && (
            <button
              style={{ ...button, background: "#64748b" }}
              onClick={() => {
                setEditingId(null);
                setForm({ ...initialForm });
                setStatuses({});
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15,
            marginBottom: 20,
          }}
        >
          <label style={{ fontSize: 13, fontWeight: 650 }}>
            Attendance Date
            <input
              style={input}
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </label>

          <label style={{ fontSize: 13, fontWeight: 650 }}>
            Course Code
            <input
              style={input}
              placeholder="Example: CSE104"
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
            />
          </label>

          <label style={{ fontSize: 13, fontWeight: 650 }}>
            Search Student
            <input
              style={input}
              placeholder="Search name or student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        {/* Bulk actions */}
        {!editingId && (
          <div
            style={{
              display: "flex",
              gap: 9,
              flexWrap: "wrap",
              padding: 13,
              borderRadius: 10,
              background: "#f8fafc",
              marginBottom: 15,
            }}
          >
            <strong style={{ fontSize: 12, marginRight: 5 }}>
              Mark All:
            </strong>

            <button
              style={{ ...button, background: "#15803d" }}
              onClick={() => setAllStatus("Present")}
              type="button"
            >
              ✓ All Present
            </button>

            <button
              style={{ ...button, background: "#dc2626" }}
              onClick={() => setAllStatus("Absent")}
              type="button"
            >
              ✕ All Absent
            </button>

            <button
              style={{ ...button, background: "#d97706" }}
              onClick={() => setAllStatus("Late")}
              type="button"
            >
              ◷ All Late
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <h3 style={{ fontSize: 15, margin: 0 }}>
            Student List ({filteredStudents.length})
          </h3>
          <span style={{ fontSize: 12, color: "#8792a5" }}>
            Present: {presentCount} | Absent: {absentCount} | Late: {lateCount}
          </span>
        </div>

        {loading ? (
          <p style={{ color: "#8792a5" }}>Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p style={{ padding: 20, color: "#8792a5", textAlign: "center" }}>
            No students found.
          </p>
        ) : (
          <div style={{ border: "1px solid #edf0f5", borderRadius: 11 }}>
            {filteredStudents.map((student, index) => {
              const currentStatus =
                statuses[String(student._id)] || "Present";

              return (
                <div className="attendance-student-row" key={student._id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 10,
                        background: "#eff6ff",
                        color: "#2563eb",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 750,
                        fontSize: 12,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {student.name}
                      </div>
                      <div style={{ color: "#8792a5", fontSize: 11 }}>
                        ID: {student.studentId || "N/A"} ·{" "}
                        {student.department || "No Department"}
                      </div>
                    </div>
                  </div>

                  <div className="attendance-status-actions">
                    <button
                      type="button"
                      style={statusButton(
                        currentStatus === "Present",
                        "#15803d",
                        "#dcfce7"
                      )}
                      onClick={() =>
                        changeStatus(student._id, "Present")
                      }
                    >
                      ✓ Present
                    </button>

                    <button
                      type="button"
                      style={statusButton(
                        currentStatus === "Absent",
                        "#b91c1c",
                        "#fee2e2"
                      )}
                      onClick={() =>
                        changeStatus(student._id, "Absent")
                      }
                    >
                      ✕ Absent
                    </button>

                    <button
                      type="button"
                      style={statusButton(
                        currentStatus === "Late",
                        "#a16207",
                        "#fef3c7"
                      )}
                      onClick={() =>
                        changeStatus(student._id, "Late")
                      }
                    >
                      ◷ Late
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <button
            type="button"
            style={{ ...button, background: "#64748b" }}
            onClick={loadData}
            disabled={saving}
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            style={{ ...button, padding: "12px 23px" }}
            disabled={saving || loading || students.length === 0}
            onClick={
              editingId ? handleSingleUpdate : handleBulkSave
            }
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Attendance"
              : `Save All Attendance (${students.length})`}
          </button>
        </div>
      </section>

      {/* Previous Records */}
      <section style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>
              Attendance Records
            </h2>
            <p style={{ color: "#8792a5", fontSize: 12, margin: "5px 0 0" }}>
              Total saved records: {totalRecords}
            </p>
          </div>

          <button
            style={{ ...button, background: "#64748b" }}
            onClick={loadData}
          >
            ↻ Refresh Records
          </button>
        </div>

        {loading ? (
          <p>Loading records...</p>
        ) : sortedRecords.length === 0 ? (
          <p style={{ textAlign: "center", padding: 25, color: "#8792a5" }}>
            No attendance records found.
          </p>
        ) : (
          <div className="attendance-table-wrap">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{record.date || "—"}</td>
                    <td>{record.studentId || "—"}</td>
                    <td style={{ fontWeight: 650 }}>
                      {record.student || "—"}
                    </td>
                    <td>{record.department || "—"}</td>
                    <td>{record.course || "—"}</td>
                    <td>
                      <span style={statusBadge(record.status)}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          style={{ ...button, padding: "7px 10px" }}
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          style={{
                            ...button,
                            padding: "7px 10px",
                            background: "#dc2626",
                          }}
                          onClick={() => handleDelete(record._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
