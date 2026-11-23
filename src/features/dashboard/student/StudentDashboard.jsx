
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

const stats = [
  {
    title: "Enrolled Courses",
    value: "06",
    subtitle: "Current semester",
    icon: "📚",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    title: "Attendance",
    value: "92%",
    subtitle: "Your attendance",
    icon: "📅",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    title: "Current CGPA",
    value: "3.75",
    subtitle: "Out of 4.00",
    icon: "🎓",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    title: "Completed Credits",
    value: "48",
    subtitle: "Academic progress",
    icon: "🏆",
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const courses = [
  { code: "CSE101", name: "Introduction to Programming", teacher: "Mr. Rahman", day: "Sunday", time: "10:00 AM" },
  { code: "CSE102", name: "Database Management System", teacher: "Ms. Nusrat", day: "Monday", time: "11:00 AM" },
  { code: "MAT101", name: "Mathematics", teacher: "Mr. Karim", day: "Tuesday", time: "09:00 AM" },
  { code: "ENG101", name: "English Communication", teacher: "Ms. Sadia", day: "Wednesday", time: "12:00 PM" },
];

const results = [
  { course: "Introduction to Programming", code: "CSE101", grade: "A", point: "3.75" },
  { course: "Mathematics", code: "MAT101", grade: "A+", point: "4.00" },
  { course: "Database Management", code: "CSE102", grade: "B+", point: "3.25" },
];

const notices = [
  { title: "Midterm Examination Schedule", date: "Nov 25, 2026", type: "Exam" },
  { title: "Semester Registration Notice", date: "Nov 27, 2026", type: "Academic" },
  { title: "University Holiday Announcement", date: "Nov 30, 2026", type: "General" },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCourses =
    activeTab === "All"
      ? courses
      : courses.filter((course) => course.day === activeTab);

  return (
    <div style={styles.page}>
      <PageHeader
        title="Student Dashboard"
        subtitle="Welcome back! Here's your academic overview."
      />

      {/* Welcome Section */}
      <div style={styles.welcome}>
        <div>
          <span style={styles.welcomeLabel}>STUDENT PORTAL</span>
          <h2 style={styles.welcomeTitle}>Welcome Back, Student! 👋</h2>
          <p style={styles.welcomeText}>
            Keep learning, stay focused and achieve your academic goals.
          </p>
        </div>
        <div style={styles.welcomeIcon}>🎓</div>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.title} style={styles.statCard}>
            <div style={styles.statTop}>
              <div
                style={{
                  ...styles.statIcon,
                  background: stat.bg,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <span style={styles.statArrow}>↗</span>
            </div>

            <h2 style={styles.statValue}>{stat.value}</h2>
            <p style={styles.statTitle}>{stat.title}</p>
            <span style={styles.statSubtitle}>{stat.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Weekly Classes */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h3 style={styles.panelTitle}>My Class Schedule</h3>
              <p style={styles.panelSubtitle}>Your weekly classes</p>
            </div>
            <span style={styles.panelIcon}>📖</span>
          </div>

          <div style={styles.tabs}>
            {["All", "Sunday", "Monday", "Tuesday", "Wednesday"].map((day) => (
              <button
                key={day}
                onClick={() => setActiveTab(day)}
                style={{
                  ...styles.tab,
                  ...(activeTab === day ? styles.activeTab : {}),
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <div style={styles.courseList}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.code} style={styles.courseItem}>
                  <div style={styles.courseDate}>
                    <span>📚</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={styles.courseName}>{course.name}</strong>
                    <p style={styles.courseInfo}>
                      {course.code} · {course.teacher}
                    </p>
                  </div>
                  <div style={styles.courseTime}>
                    <strong>{course.time}</strong>
                    <span>{course.day}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.empty}>No classes scheduled for this day.</p>
            )}
          </div>
        </section>

        {/* Notices */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h3 style={styles.panelTitle}>Notice Board</h3>
              <p style={styles.panelSubtitle}>Latest university updates</p>
            </div>
            <span style={styles.panelIcon}>🔔</span>
          </div>

          <div style={styles.noticeList}>
            {notices.map((notice, index) => (
              <div key={index} style={styles.noticeItem}>
                <div style={styles.noticeIcon}>📢</div>
                <div style={{ flex: 1 }}>
                  <strong style={styles.noticeTitle}>{notice.title}</strong>
                  <p style={styles.noticeDate}>{notice.date}</p>
                </div>
                <span style={styles.noticeBadge}>{notice.type}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Results */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h3 style={styles.panelTitle}>Recent Academic Results</h3>
            <p style={styles.panelSubtitle}>Your latest course performance</p>
          </div>
          <span style={styles.panelIcon}>🏆</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Course Code</th>
                <th style={styles.th}>Course Name</th>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Grade Point</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.code}>
                  <td style={styles.td}>{result.code}</td>
                  <td style={styles.td}>{result.course}</td>
                  <td style={styles.td}>
                    <strong style={styles.grade}>{result.grade}</strong>
                  </td>
                  <td style={styles.td}>{result.point}</td>
                  <td style={styles.td}>
                    <span style={styles.completed}>Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Section */}
      <div style={styles.bottomGrid}>
        <div style={styles.progressCard}>
          <h3 style={styles.panelTitle}>Attendance Overview</h3>
          <p style={styles.panelSubtitle}>Your overall class attendance</p>

          <div style={styles.progressRow}>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill} />
            </div>
            <strong style={styles.progressValue}>92%</strong>
          </div>

          <p style={styles.progressNote}>
            Great work! Keep maintaining your attendance.
          </p>
        </div>

        <div style={styles.tipCard}>
          <span style={{ fontSize: 30 }}>💡</span>
          <div>
            <h3 style={styles.tipTitle}>Student Tip</h3>
            <p style={styles.tipText}>
              Stay organized, attend your classes regularly and review your
              lessons every day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
    paddingBottom: 30,
  },
  welcome: {
    background: "linear-gradient(120deg, #1e40af, #2563eb, #4f46e5)",
    color: "#fff",
    borderRadius: 16,
    padding: "28px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  welcomeLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    opacity: 0.8,
  },
  welcomeTitle: {
    fontSize: 25,
    margin: "10px 0",
    fontWeight: 700,
  },
  welcomeText: {
    margin: 0,
    fontSize: 14,
    opacity: 0.9,
  },
  welcomeIcon: {
    fontSize: 65,
    background: "rgba(255,255,255,0.15)",
    width: 95,
    height: 95,
    display: "grid",
    placeItems: "center",
    borderRadius: 20,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 16,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 13,
    padding: 20,
    boxShadow: "0 3px 12px rgba(0,0,0,0.035)",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontSize: 22,
  },
  statArrow: {
    color: "#9ca3af",
    fontSize: 20,
  },
  statValue: {
    fontSize: 29,
    color: "#111827",
    margin: "17px 0 3px",
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    margin: "0 0 5px",
  },
  statSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
  },
  panel: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 3px 12px rgba(0,0,0,0.035)",
    minWidth: 0,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  panelTitle: {
    margin: 0,
    fontSize: 17,
    color: "#111827",
    fontWeight: 700,
  },
  panelSubtitle: {
    color: "#9ca3af",
    fontSize: 12,
    margin: "5px 0 0",
  },
  panelIcon: {
    fontSize: 25,
  },
  tabs: {
    display: "flex",
    gap: 7,
    flexWrap: "wrap",
    marginBottom: 15,
  },
  tab: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "7px 11px",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 11,
    color: "#6b7280",
  },
  activeTab: {
    background: "#2563eb",
    color: "#fff",
    borderColor: "#2563eb",
  },
  courseList: {
    display: "flex",
    flexDirection: "column",
  },
  courseItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  courseDate: {
    width: 42,
    height: 42,
    background: "#eff6ff",
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    fontSize: 19,
  },
  courseName: {
    fontSize: 13,
    color: "#374151",
  },
  courseInfo: {
    fontSize: 11,
    color: "#9ca3af",
    margin: "5px 0 0",
  },
  courseTime: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 5,
    fontSize: 11,
    color: "#374151",
  },
  empty: {
    color: "#9ca3af",
    fontSize: 13,
    padding: 20,
    textAlign: "center",
  },
  noticeList: {
    display: "flex",
    flexDirection: "column",
  },
  noticeItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "15px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#fff7ed",
    display: "grid",
    placeItems: "center",
  },
  noticeTitle: {
    fontSize: 12,
    color: "#374151",
  },
  noticeDate: {
    color: "#9ca3af",
    fontSize: 11,
    margin: "5px 0 0",
  },
  noticeBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "5px 8px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 550,
    textAlign: "left",
  },
  th: {
    background: "#f9fafb",
    color: "#6b7280",
    padding: "13px 12px",
    fontSize: 12,
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "14px 12px",
    color: "#4b5563",
    fontSize: 12,
    borderBottom: "1px solid #f3f4f6",
  },
  grade: {
    background: "#ecfdf5",
    color: "#059669",
    padding: "5px 10px",
    borderRadius: 6,
  },
  completed: {
    background: "#ecfdf5",
    color: "#059669",
    padding: "5px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 18,
  },
  progressCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 22,
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginTop: 22,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    background: "#e5e7eb",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    width: "92%",
    height: "100%",
    background: "linear-gradient(90deg, #10b981, #34d399)",
    borderRadius: 20,
  },
  progressValue: {
    color: "#059669",
    fontSize: 20,
  },
  progressNote: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 16,
  },
  tipCard: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 14,
    padding: 22,
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  tipTitle: {
    color: "#92400e",
    fontSize: 16,
    margin: "0 0 7px",
  },
  tipText: {
    color: "#a16207",
    fontSize: 12,
    lineHeight: 1.7,
    margin: 0,
  },
};
