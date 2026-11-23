
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { studentService } from "@/features/students/services/studentService";
import { teacherService } from "@/features/teachers/services/teacherService";
import { courseService } from "@/features/courses/services/courseService";
import { departmentService } from "@/features/departments/services/departmentService";

import StudentEnrollmentChart from "./components/StudentEnrollmentChart";
import TeacherEnrollmentChart from "./components/TeacherEnrollmentChart";
import { activityService } from "./services/activityService";

const initialStats = {
  students: 0,
  teachers: 0,
  courses: 0,
  departments: 0,
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);

  // Fetch Dashboard Statistics
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          studentData,
          teacherData,
          courseData,
          departmentData,
        ] = await Promise.all([
          studentService.getAll(),
          teacherService.getAll(),
          courseService.getAll(),
          departmentService.getAll(),
        ]);

        if (!isMounted) return;

        const studentResult = studentData?.data ?? studentData;
        const teacherResult = teacherData?.data ?? teacherData;
        const courseResult = courseData?.data ?? courseData;
        const departmentResult = departmentData?.data ?? departmentData;

        setStats({
          students:
            studentResult.count ??
            studentResult.students?.length ??
            0,

          teachers:
            teacherResult.count ??
            teacherResult.teachers?.length ??
            0,

          courses:
            courseResult.count ??
            courseResult.courses?.length ??
            courseResult.data?.length ??
            (Array.isArray(courseResult) ? courseResult.length : 0),

          departments:
            departmentResult.count ??
            departmentResult.departments?.length ??
            0,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);

        if (isMounted) {
          setError("Unable to load dashboard statistics.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Fetch Recent Activities
  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      try {
        setActivityLoading(true);
        setActivityError("");

        const response = await activityService.getRecent();
        const result = response?.data ?? response;

        if (!isMounted) return;

        setActivities(
          Array.isArray(result?.activities)
            ? result.activities
            : []
        );
      } catch (err) {
        console.error("Activity loading error:", err);

        if (isMounted) {
          setActivityError(
            err?.response?.data?.message ||
            "Unable to load recent activities."
          );
        }
      } finally {
        if (isMounted) {
          setActivityLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [activityRefreshKey]);

  // Statistics Cards
  const statCards = [
    {
      title: "Total Students",
      value: stats.students,
      description: "Registered students",
      icon: "🎓",
      color: "#2563eb",
      background: "#eff6ff",
      path: "/admin/students",
    },
    {
      title: "Total Teachers",
      value: stats.teachers,
      description: "Registered teachers",
      icon: "👨‍🏫",
      color: "#059669",
      background: "#ecfdf5",
      path: "/admin/teachers",
    },
    {
      title: "Total Courses",
      value: stats.courses,
      description: "Available courses",
      icon: "📚",
      color: "#7c3aed",
      background: "#f5f3ff",
      path: "/admin/courses",
    },
    {
      title: "Departments",
      value: stats.departments,
      description: "Academic departments",
      icon: "🏢",
      color: "#d97706",
      background: "#fffbeb",
      path: "/admin/departments",
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      title: "Add Student",
      description: "Register a new student",
      icon: "🎓",
      color: "#2563eb",
      background: "#eff6ff",
      path: "/admin/students",
    },
    {
      title: "Add Teacher",
      description: "Register a new teacher",
      icon: "👨‍🏫",
      color: "#059669",
      background: "#ecfdf5",
      path: "/admin/teachers",
    },
    {
      title: "Add Course",
      description: "Create a new course",
      icon: "📚",
      color: "#7c3aed",
      background: "#f5f3ff",
      path: "/admin/courses",
    },
    {
      title: "Add Department",
      description: "Create a department",
      icon: "🏢",
      color: "#d97706",
      background: "#fffbeb",
      path: "/admin/departments",
    },
  ];

  const activityIcons = {
    Student: "🎓",
    Teacher: "👨‍🏫",
    Course: "📚",
    Department: "🏢",
  };

  const actionColors = {
    created: {
      color: "#15803D",
      background: "#DCFCE7",
      border: "#BBF7D0",
    },
    updated: {
      color: "#1D4ED8",
      background: "#DBEAFE",
      border: "#BFDBFE",
    },
    deleted: {
      color: "#B91C1C",
      background: "#FEE2E2",
      border: "#FECACA",
    },
  };

  return (
    <div style={styles.page}>

      {/* Dashboard Header */}
      <div style={styles.dashboardHeader}>
        <div>
          <div style={styles.breadcrumb}>
            <span>University</span>
            <span style={{ color: "#cbd5e1" }}> / </span>
            <strong>Dashboard</strong>
          </div>

          <h1 style={styles.dashboardTitle}>
            Admin Dashboard
          </h1>

          <p style={styles.dashboardSubtitle}>
            University Management System Overview
          </p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div style={styles.welcomeContent}>
          <span style={styles.welcomeLabel}>
            <span style={styles.welcomeLabelDot} />
            ADMINISTRATION PANEL
          </span>

          <h2 style={styles.welcomeTitle}>
            Welcome back, Admin! 👋
          </h2>

          <p style={styles.welcomeText}>
            Manage your university activities, monitor academic
            performance and keep everything organized from one place.
          </p>
        </div>

        <div style={styles.welcomeVisual}>
          <div style={styles.welcomeVisualCircle}>🏛️</div>
          <div style={styles.welcomeVisualSmall}>🎓</div>
        </div>
      </div>

      {/* University Statistics */}
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.sectionEyebrow}>
            OVERVIEW
          </div>

          <h3 style={styles.sectionTitle}>
            University Statistics
          </h3>

          <p style={styles.sectionSubtitle}>
            Overview of your university records
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshKey((key) => key + 1);
            setActivityRefreshKey((key) => key + 1);
          }}
          disabled={loading}
          style={{
            ...styles.refreshButton,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <span style={{ fontSize: 16 }}>↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => navigate(item.path)}
            style={styles.statCard}
          >
            <div style={styles.statTop}>
              <div
                style={{
                  ...styles.statIcon,
                  background: item.background,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>

              <span style={styles.statArrow}>↗</span>
            </div>

            <h2 style={styles.statValue}>
              {loading ? "..." : item.value}
            </h2>

            <p style={styles.statTitle}>
              {item.title}
            </p>

            <span style={styles.statDescription}>
              {item.description}
            </span>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActionsSection}>
        <div>
          <div style={styles.sectionEyebrow}>
            SHORTCUTS
          </div>

          <h3 style={styles.sectionTitle}>
            Quick Actions
          </h3>

          <p style={styles.sectionSubtitle}>
            Quickly access important management pages
          </p>
        </div>

        <div style={styles.quickActionsGrid}>
          {quickActions.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
              style={styles.quickActionCard}
            >
              <div
                style={{
                  ...styles.quickActionIcon,
                  background: item.background,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>

              <div style={{ textAlign: "left", flex: 1 }}>
                <strong style={styles.quickActionTitle}>
                  {item.title}
                </strong>

                <p style={styles.quickActionDescription}>
                  {item.description}
                </p>
              </div>

              <span style={styles.quickActionArrow}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enrollment Analytics */}
      <div style={styles.chartSection}>
        <div style={styles.sectionHeader}>
          <div>
            <div style={styles.analyticsEyebrow}>
              PERFORMANCE INSIGHTS
            </div>

            <h3 style={styles.analyticsTitle}>
              Enrollment Analytics
            </h3>

            <p style={styles.analyticsSubtitle}>
              Monthly student and teacher registration
            </p>
          </div>

          <span style={styles.analyticsIcon}>📊</span>
        </div>

        <StudentEnrollmentChart />
        <TeacherEnrollmentChart />
      </div>

      {/* Recent Activities */}
      <div style={styles.activityCard}>
        <div style={styles.activityHeader}>
          <div style={styles.activityHeading}>
            <div style={styles.activityMainIcon}>📋</div>

            <div>
              <div style={styles.analyticsEyebrow}>
                SYSTEM MONITORING
              </div>

              <h3 style={styles.overviewTitle}>
                Recent Activities
              </h3>

              <p style={styles.overviewSubtitle}>
                Latest university management activities
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setActivityRefreshKey((key) => key + 1)
            }
            disabled={activityLoading}
            style={{
              ...styles.activityRefresh,
              opacity: activityLoading ? 0.6 : 1,
              cursor: activityLoading ? "not-allowed" : "pointer",
            }}
          >
            ↻ {activityLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {activityError && (
          <div style={styles.activityError}>
            {activityError}
          </div>
        )}

        {activityLoading ? (
          <div style={styles.emptyActivity}>
            <div style={styles.emptyActivityIcon}>⏳</div>

            <h4 style={styles.emptyActivityTitle}>
              Loading Activities...
            </h4>
          </div>
        ) : activities.length === 0 ? (
          <div style={styles.emptyActivity}>
            <div style={styles.emptyActivityIcon}>🗂️</div>

            <h4 style={styles.emptyActivityTitle}>
              No Recent Activities Yet
            </h4>

            <p style={styles.emptyActivityText}>
              Student, teacher, course and department activities
              will appear here after you add, update or delete records.
            </p>
          </div>
        ) : (
          <div style={styles.activityList}>
            {activities.map((activity) => {
              const actionStyle =
                actionColors[activity.action] || actionColors.updated;

              return (
                <div
                  key={activity._id}
                  style={styles.activityItem}
                >
                  <div style={styles.activityEntityIcon}>
                    {activityIcons[activity.entityType] || "📌"}
                  </div>

                  <div style={styles.activityInfo}>
                    <div style={styles.activityName}>
                      {activity.entityName}
                    </div>

                    <p style={styles.activityDescription}>
                      {activity.description}
                    </p>

                    <div style={styles.activityMeta}>
                      <span>
                        Admin: {activity.performedByName || "Admin"}
                      </span>

                      <span>•</span>

                      <span>
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString(
                              "en-BD",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }
                            )
                          : "Recently"}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      ...styles.actionBadge,
                      color: actionStyle.color,
                      background: actionStyle.background,
                      border: `1px solid ${actionStyle.border}`,
                    }}
                  >
                    {activity.action}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.activityFooter}>
          <span style={styles.footerDot} />
          Your university records are being tracked
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 25,
    padding: 20,
    paddingBottom: 35,
    width: "100%",
    background: "#EAF3FF",
    minHeight: "100vh",
    borderRadius: 16,
  },

  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    padding: "5px 2px 12px",
  },

  breadcrumb: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    marginBottom: 9,
  },

  dashboardTitle: {
    fontSize: 27,
    fontWeight: 850,
    color: "var(--color-text)",
    margin: 0,
    letterSpacing: "-0.8px",
  },

  dashboardSubtitle: {
    fontSize: 12,
    color: "var(--color-muted)",
    margin: "7px 0 0",
  },

  welcomeBanner: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(115deg, #101d3a 0%, #1e40af 55%, #4338ca 100%)",
    borderRadius: 22,
    padding: "34px 36px",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    boxShadow: "0 14px 35px rgba(30,64,175,0.20)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  welcomeContent: {
    position: "relative",
    zIndex: 1,
    flex: 1,
  },

  welcomeLabel: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 2.5,
    color: "#bfdbfe",
    background: "rgba(255,255,255,0.10)",
    padding: "8px 13px",
    borderRadius: 20,
  },

  welcomeLabelDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4ade80",
    display: "inline-block",
    marginRight: 8,
  },

  welcomeTitle: {
    fontSize: 27,
    fontWeight: 800,
    margin: "16px 0 9px",
    letterSpacing: "-0.8px",
    color: "#ffffff",
  },

  welcomeText: {
    fontSize: 13,
    lineHeight: 1.8,
    color: "#dbeafe",
    maxWidth: 550,
    margin: 0,
  },

  welcomeVisual: {
    position: "relative",
    width: 110,
    height: 100,
    display: "grid",
    placeItems: "center",
  },

  welcomeVisualCircle: {
    width: 88,
    height: 88,
    borderRadius: 25,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: 43,
  },

  welcomeVisualSmall: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 35,
    height: 35,
    display: "grid",
    placeItems: "center",
    background: "#ffffff",
    borderRadius: 11,
    fontSize: 18,
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    padding: "3px 2px",
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: 800,
    color: "#2563eb",
    letterSpacing: 1.7,
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 800,
    color: "var(--color-text)",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "var(--color-muted)",
    margin: "6px 0 0",
    lineHeight: 1.6,
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    border: "1px solid #3b82f6",
    borderRadius: 10,
    padding: "10px 17px",
    fontSize: 12,
    fontWeight: 750,
    cursor: "pointer",
    boxShadow: "0 5px 13px rgba(37,99,235,0.20)",
  },

  errorBox: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 18,
  },

  statCard: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    border: "1px solid #e2e8f0",
    borderRadius: 19,
    padding: "22px 21px",
    boxShadow: "0 5px 20px rgba(15,23,42,0.045)",
    textAlign: "left",
    width: "100%",
    cursor: "pointer",
    color: "#0f172a",
    fontFamily: "inherit",
    transition: "all 0.25s ease",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    fontSize: 25,
    boxShadow: "0 5px 13px rgba(15,23,42,0.06)",
  },

  statArrow: {
    width: 31,
    height: 31,
    borderRadius: 10,
    background: "#f1f5f9",
    display: "grid",
    placeItems: "center",
    fontSize: 17,
    color: "#64748b",
  },

  statValue: {
    fontSize: 36,
    fontWeight: 850,
    color: "#0f172a",
    margin: "21px 0 5px",
    letterSpacing: "-1.5px",
  },

  statTitle: {
    fontSize: 14,
    fontWeight: 750,
    color: "#334155",
    margin: "0 0 7px",
  },

  statDescription: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 500,
  },

  quickActionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 17,
  },

  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  quickActionCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "19px 17px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    boxShadow: "0 5px 17px rgba(15,23,42,0.045)",
    transition: "all 0.25s ease",
  },

  quickActionIcon: {
    width: 49,
    height: 49,
    minWidth: 49,
    borderRadius: 15,
    display: "grid",
    placeItems: "center",
    fontSize: 24,
    boxShadow: "0 4px 12px rgba(15,23,42,0.055)",
  },

  quickActionTitle: {
    display: "block",
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "-0.2px",
  },

  quickActionDescription: {
    color: "#94a3b8",
    fontSize: 11,
    margin: "6px 0 0",
    lineHeight: 1.5,
  },

  quickActionArrow: {
    fontSize: 22,
    color: "#64748b",
    marginLeft: "auto",
    fontWeight: 600,
  },

  chartSection: {
    display: "flex",
    flexDirection: "column",
    gap: 19,
    padding: 23,
    borderRadius: 21,
    background: "linear-gradient(145deg, #F8FAFF 0%, #EEF4FF 100%)",
    border: "1px solid #DBEAFE",
    boxShadow: "0 8px 24px rgba(37,99,235,0.06)",
  },

  analyticsEyebrow: {
    fontSize: 9,
    fontWeight: 800,
    color: "#2563EB",
    letterSpacing: 1.7,
    marginBottom: 6,
  },

  analyticsTitle: {
    fontSize: 19,
    fontWeight: 800,
    color: "#172554",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  analyticsSubtitle: {
    fontSize: 12,
    color: "#526783",
    margin: "6px 0 0",
    lineHeight: 1.6,
  },

  analyticsIcon: {
    width: 45,
    height: 45,
    display: "grid",
    placeItems: "center",
    borderRadius: 14,
    background: "#D2E3F8",
    border: "1px solid #B8D0EF",
    fontSize: 23,
  },

  // Recent Activities - Medium Soft Blue
  activityCard: {
    background: "linear-gradient(145deg, #E2ECFA, #DCE8F7)",
    border: "1px solid #C7D8EE",
    borderRadius: 21,
    padding: 23,
    boxShadow: "0 5px 15px rgba(37,99,235,0.07)",
    color: "#172554",
  },

  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 21,
  },

  activityHeading: {
    display: "flex",
    alignItems: "center",
    gap: 13,
  },

  activityMainIcon: {
    width: 46,
    height: 46,
    background: "#D2E3F8",
    border: "1px solid #B8D0EF",
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontSize: 22,
  },

  overviewTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: "#172554",
    margin: 0,
    letterSpacing: "-0.3px",
  },

  overviewSubtitle: {
    fontSize: 11,
    color: "#526783",
    margin: "6px 0 0",
  },

  activityRefresh: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    border: "1px solid #3b82f6",
    borderRadius: 10,
    padding: "9px 14px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.16)",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: 11,
    maxHeight: 420,
    overflowY: "auto",
    padding: "2px 5px 2px 0",
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "15px 15px",
    border: "1px solid #D0DFF0",
    borderRadius: 14,
    background: "linear-gradient(110deg, #F1F6FD, #EAF2FC)",
    transition: "all 0.2s ease",
    minWidth: 0,
  },

  activityEntityIcon: {
    width: 43,
    height: 43,
    minWidth: 43,
    borderRadius: 13,
    background: "#DCE9F9",
    border: "1px solid #C4D8F0",
    display: "grid",
    placeItems: "center",
    fontSize: 21,
  },

  activityInfo: {
    flex: 1,
    minWidth: 0,
  },

  activityName: {
    fontSize: 13,
    fontWeight: 800,
    color: "#172554",
    marginBottom: 2,
  },

  activityDescription: {
    fontSize: 11,
    color: "#334B6B",
    margin: "5px 0 7px",
    lineHeight: 1.6,
  },

  activityMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 10,
    color: "#647B98",
  },

  actionBadge: {
    padding: "6px 11px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "capitalize",
    flexShrink: 0,
    letterSpacing: "0.2px",
  },

  emptyActivity: {
    textAlign: "center",
    padding: "38px 18px",
    background: "#F1F6FD",
    border: "1px dashed #B8D0EF",
    borderRadius: 15,
  },

  emptyActivityIcon: {
    fontSize: 34,
    marginBottom: 12,
  },

  emptyActivityTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#172554",
    margin: "0 0 9px",
  },

  emptyActivityText: {
    fontSize: 11,
    lineHeight: 1.8,
    color: "#647B98",
    maxWidth: 420,
    margin: "0 auto",
  },

  activityFooter: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    borderTop: "1px solid #C7D8EE",
    paddingTop: 15,
    marginTop: 18,
    color: "#526783",
    fontSize: 10,
  },

  footerDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 10px rgba(34,197,94,0.3)",
  },

  activityError: {
    background: "#FEE2E2",
    color: "#B91C1C",
    border: "1px solid #FECACA",
    borderRadius: 10,
    padding: 12,
    fontSize: 11,
    marginBottom: 12,
  },
};
