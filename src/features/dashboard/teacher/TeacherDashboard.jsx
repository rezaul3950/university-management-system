
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "@/features/students/services/studentService";
import { attendanceService } from "@/features/attendance/services/attendanceService";
import { storage } from "@/services/storage";

const today = new Date().toLocaleDateString("en-CA");

const styles = `
.teacher-dashboard {
  width: 100%;
  color: var(--color-text, #172033);
}
.teacher-dashboard * { box-sizing: border-box; }
.teacher-welcome {
  position: relative;
  overflow: hidden;
  padding: 30px;
  border-radius: 20px;
  background: linear-gradient(120deg, #153e9b, #2563eb 65%, #548cf5);
  color: white;
  margin-bottom: 25px;
}
.teacher-welcome::after {
  content: "";
  position: absolute;
  width: 230px;
  height: 230px;
  border: 35px solid rgba(255,255,255,.09);
  border-radius: 50%;
  right: 45px;
  top: -100px;
}
.teacher-welcome h2 { font-size: 27px; margin: 0 0 9px; }
.teacher-welcome p { margin: 0; color: #dce8ff; font-size: 14px; }
.teacher-welcome-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 24px;
}
.teacher-welcome button {
  background: white;
  color: #1d4ed8;
  border: 0;
  border-radius: 9px;
  padding: 11px 18px;
  font-weight: 700;
  cursor: pointer;
}
.teacher-section-title {
  font-size: 18px;
  font-weight: 750;
  margin: 25px 0 15px;
}
.teacher-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.teacher-stat {
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e8edf5);
  border-radius: 15px;
  padding: 19px;
  min-width: 0;
  box-shadow: 0 3px 12px rgba(15,23,42,.035);
}
.teacher-stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.teacher-stat-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 21px;
}
.teacher-stat-label { color: #788398; font-size: 13px; margin-top: 14px; }
.teacher-stat-value { font-size: 27px; font-weight: 800; margin-top: 5px; }
.teacher-stat-note { color: #8792a5; font-size: 12px; margin-top: 5px; }
.teacher-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(270px, .8fr);
  gap: 18px;
  margin-top: 22px;
}
.teacher-panel {
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #e8edf5);
  border-radius: 16px;
  padding: 21px;
  min-width: 0;
  box-shadow: 0 3px 12px rgba(15,23,42,.035);
}
.teacher-panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.teacher-panel-heading h3 { font-size: 16px; margin: 0; }
.teacher-panel-heading span { font-size: 12px; color: #8792a5; }
.teacher-progress-row { margin: 19px 0; }
.teacher-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 9px;
}
.teacher-progress-track {
  height: 9px;
  border-radius: 20px;
  background: #edf1f7;
  overflow: hidden;
}
.teacher-progress-fill {
  height: 100%;
  border-radius: 20px;
  transition: width .3s;
}
.teacher-quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}
.teacher-quick-action {
  padding: 17px 12px;
  border: 1px solid #e6ecf5;
  border-radius: 12px;
  background: var(--color-surface, white);
  cursor: pointer;
  text-align: left;
  color: inherit;
  transition: .2s;
}
.teacher-quick-action:hover {
  border-color: #7ba4f8;
  background: #f5f8ff;
  transform: translateY(-2px);
}
.teacher-quick-action b { display: block; font-size: 13px; margin-top: 9px; }
.teacher-quick-action small { color: #8792a5; font-size: 11px; }
.teacher-quick-icon { font-size: 23px; }
.teacher-table-wrap { overflow-x: auto; }
.teacher-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 530px;
}
.teacher-table th {
  text-align: left;
  color: #8993a5;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .5px;
  padding: 12px 10px;
  border-bottom: 1px solid #edf0f5;
}
.teacher-table td {
  padding: 14px 10px;
  font-size: 13px;
  border-bottom: 1px solid #f0f2f6;
}
.teacher-table tr:last-child td { border-bottom: 0; }
.teacher-status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}
.teacher-status.present { background: #dcfce7; color: #15803d; }
.teacher-status.absent { background: #fee2e2; color: #b91c1c; }
.teacher-status.late { background: #fef3c7; color: #a16207; }
.teacher-empty {
  padding: 28px 12px;
  text-align: center;
  color: #8993a5;
  font-size: 13px;
}
.teacher-refresh {
  border: 1px solid #dce4ef;
  background: var(--color-surface, white);
  color: inherit;
  padding: 8px 13px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 12px;
}
.teacher-error {
  padding: 12px 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  background: #fff1f2;
  color: #be123c;
  font-size: 13px;
}
.teacher-loading { color: #8792a5; font-size: 13px; padding: 20px 0; }
@media(max-width: 900px) {
  .teacher-stat-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .teacher-main-grid { grid-template-columns: 1fr; }
}
@media(max-width: 520px) {
  .teacher-welcome { padding: 22px 18px; }
  .teacher-welcome h2 { font-size: 22px; }
  .teacher-stat { padding: 14px; }
  .teacher-stat-value { font-size: 23px; }
  .teacher-panel { padding: 15px; }
}
`;

function getList(response, key) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[key])) return response[key];
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.[key])) return response.data[key];
  return [];
}

function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(date + (String(date).length === 10 ? "T00:00:00" : ""));
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const user = storage.getUser() || {};

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const teacherId = String(user._id || user.id || user.userId || "");
  const teacherName = user.name || user.fullName || "Teacher";

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentResponse, attendanceResponse] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
      ]);

      const studentList = getList(studentResponse, "students");
      const attendanceList = getList(attendanceResponse, "data");

      setStudents(studentList.filter((student) => student.status !== "inactive"));

      // Only show records belonging to the logged-in teacher.
      const ownRecords = attendanceList.filter((record) => {
        const recordTeacherId =
          record.teacherId?._id || record.teacherId || "";
        if (teacherId && recordTeacherId) {
          return String(recordTeacherId) === teacherId;
        }
        return (
          record.teacherName &&
          record.teacherName.toLowerCase() === teacherName.toLowerCase()
        );
      });

      setRecords(ownRecords);
    } catch (err) {
      setError(err.message || "Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const todayRecords = useMemo(
    () => records.filter((record) => record.date === today),
    [records]
  );

  const presentCount = todayRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = todayRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const lateCount = todayRecords.filter(
    (record) => record.status === "Late"
  ).length;

  const attendanceRate = todayRecords.length
    ? Math.round((presentCount / todayRecords.length) * 100)
    : 0;

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 6);

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      note: "Active student accounts",
      icon: "👨‍🎓",
      bg: "#eaf1ff",
    },
    {
      label: "Present Today",
      value: presentCount,
      note: "Students marked present",
      icon: "✓",
      bg: "#dcfce7",
    },
    {
      label: "Absent Today",
      value: absentCount,
      note: "Students marked absent",
      icon: "✕",
      bg: "#fee2e2",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      note: "Today's attendance",
      icon: "📊",
      bg: "#f3e8ff",
    },
  ];

  return (
    <div className="teacher-dashboard">
      <style>{styles}</style>

      <div className="teacher-welcome">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "#dce8ff", marginBottom: 12 }}>
            UNIVERSITY MANAGEMENT SYSTEM
          </div>
          <h2>Welcome back, {teacherName}! 👋</h2>
          <p>
            Manage your students, track attendance and stay updated with your
            teaching activities.
          </p>
          <div className="teacher-welcome-bottom">
            <div>
              <div style={{ fontSize: 12, color: "#dce8ff" }}>TODAY</div>
              <strong>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </div>
            <button onClick={() => navigate("/attendance")}>
              + Take Attendance
            </button>
          </div>
        </div>
      </div>

      {error && <div className="teacher-error">{error}</div>}

      <div className="teacher-panel-heading">
        <div>
          <h3 className="teacher-section-title" style={{ margin: 0 }}>
            Dashboard Overview
          </h3>
          <span style={{ color: "#8792a5", fontSize: 12 }}>
            Your teaching activity at a glance
          </span>
        </div>
        <button className="teacher-refresh" onClick={loadDashboard}>
          ↻ Refresh
        </button>
      </div>

      <div className="teacher-stat-grid">
        {stats.map((item) => (
          <div className="teacher-stat" key={item.label}>
            <div className="teacher-stat-top">
              <span style={{ fontWeight: 650, fontSize: 13 }}>
                {item.label}
              </span>
              <span
                className="teacher-stat-icon"
                style={{ background: item.bg }}
              >
                {item.icon}
              </span>
            </div>
            <div className="teacher-stat-value">
              {loading ? "..." : item.value}
            </div>
            <div className="teacher-stat-note">{item.note}</div>
          </div>
        ))}
      </div>

      <div className="teacher-main-grid">
        <section className="teacher-panel">
          <div className="teacher-panel-heading">
            <h3>Today's Attendance Summary</h3>
            <span>{formatDate(today)}</span>
          </div>

          {loading ? (
            <div className="teacher-loading">Loading attendance...</div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  flexWrap: "wrap",
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 105,
                    height: 105,
                    borderRadius: "50%",
                    background: `conic-gradient(#2563eb ${attendanceRate}%, #e9eef6 0)`,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 82,
                      height: 82,
                      background: "var(--color-surface, white)",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 23 }}>{attendanceRate}%</strong>
                      <div style={{ fontSize: 10, color: "#8792a5" }}>
                        Attendance
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {todayRecords.length} attendance records
                  </div>
                  <div style={{ fontSize: 12, color: "#8792a5", marginTop: 6 }}>
                    Recorded by you today
                  </div>
                </div>
              </div>

              {[
                { label: "Present", value: presentCount, color: "#16a34a" },
                { label: "Absent", value: absentCount, color: "#ef4444" },
                { label: "Late", value: lateCount, color: "#e5a000" },
              ].map((item) => (
                <div className="teacher-progress-row" key={item.label}>
                  <div className="teacher-progress-info">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="teacher-progress-track">
                    <div
                      className="teacher-progress-fill"
                      style={{
                        width: `${
                          todayRecords.length
                            ? (item.value / todayRecords.length) * 100
                            : 0
                        }%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        <section className="teacher-panel">
          <div className="teacher-panel-heading">
            <h3>Quick Actions</h3>
            <span>Shortcuts</span>
          </div>

          <div className="teacher-quick-grid">
            <button
              className="teacher-quick-action"
              onClick={() => navigate("/attendance")}
            >
              <span className="teacher-quick-icon">📝</span>
              <b>Take Attendance</b>
              <small>Mark student presence</small>
            </button>

            <button
              className="teacher-quick-action"
              onClick={() => navigate("/students")}
            >
              <span className="teacher-quick-icon">👨‍🎓</span>
              <b>Students</b>
              <small>View student list</small>
            </button>

            <button
              className="teacher-quick-action"
              onClick={() => navigate("/results")}
            >
              <span className="teacher-quick-icon">📋</span>
              <b>Results</b>
              <small>Manage results</small>
            </button>

            <button
              className="teacher-quick-action"
              onClick={() => navigate("/notices")}
            >
              <span className="teacher-quick-icon">📢</span>
              <b>Notices</b>
              <small>View announcements</small>
            </button>
          </div>
        </section>
      </div>

      <section className="teacher-panel" style={{ marginTop: 22 }}>
        <div className="teacher-panel-heading">
          <div>
            <h3>Recent Attendance Records</h3>
            <span>Your latest attendance activity</span>
          </div>
          <button
            className="teacher-refresh"
            onClick={() => navigate("/attendance")}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="teacher-loading">Loading records...</div>
        ) : recentRecords.length === 0 ? (
          <div className="teacher-empty">
            <div style={{ fontSize: 30, marginBottom: 8 }}>📅</div>
            <strong>No attendance records found</strong>
            <p>Start by taking attendance for your students.</p>
          </div>
        ) : (
          <div className="teacher-table-wrap">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{formatDate(record.date)}</td>
                    <td style={{ fontWeight: 650 }}>
                      {record.student || "Unknown"}
                    </td>
                    <td>{record.studentId || "—"}</td>
                    <td>{record.course || "—"}</td>
                    <td>
                      <span
                        className={`teacher-status ${String(
                          record.status || ""
                        ).toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div
        style={{
          marginTop: 20,
          padding: "15px 18px",
          borderRadius: 12,
          background: "#eff6ff",
          color: "#1e40af",
          fontSize: 12,
        }}
      >
        💡 <strong>Tip:</strong> Take attendance regularly to keep your class
        records accurate and up to date.
      </div>
    </div>
  );
}
