
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";

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

  // Fetch dashboard statistics
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

  // Fetch recent activities
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
      color: "#059669",
      background: "#ecfdf5",
    },
    updated: {
      color: "#2563eb",
      background: "#eff6ff",
    },
    deleted: {
      color: "#dc2626",
      background: "#fef2f2",
    },
  };

  return (
    <div style={styles.page}>
      <PageHeader
        title="Admin Dashboard"
        subtitle="University Management System Overview"
      />

      {/* Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <span style={styles.welcomeLabel}>
            ADMINISTRATION PANEL
          </span>

          <h2 style={styles.welcomeTitle}>
            Welcome to Admin Dashboard 👋
          </h2>

          <p style={styles.welcomeText}>
            Manage your university activities, monitor academic
            performance and keep everything organized.
          </p>
        </div>

        <div style={styles.welcomeIcon}>🏛️</div>
      </div>

      {/* University Statistics */}
      <div style={styles.sectionHeader}>
        <div>
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
          ↻ {loading ? "Loading..." : "Refresh"}
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
            <h3 style={styles.sectionTitle}>
              Enrollment Analytics
            </h3>

            <p style={styles.sectionSubtitle}>
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
              ...styles.refreshButton,
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
              Student, teacher, course and department
              activities will appear here after you add,
              update or delete records.
            </p>
          </div>
        ) : (
          <div style={styles.activityList}>
            {activities.map((activity) => {
              const actionStyle =
                actionColors[activity.action] ||
                actionColors.updated;

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
                        {activity.performedByName || "Admin"}
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
          Keep your university records updated.
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

  welcomeBanner: {
    background: "linear-gradient(120deg, #172554, #1d4ed8, #4f46e5)",
    borderRadius: 16,
    padding: 30,
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    boxShadow: "0 8px 25px rgba(37,99,235,0.15)",
  },

  welcomeLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    opacity: 0.8,
  },

  welcomeTitle: {
    fontSize: 25,
    fontWeight: 700,
    margin: "12px 0",
  },

  welcomeText: {
    fontSize: 13,
    lineHeight: 1.7,
    opacity: 0.9,
    maxWidth: 550,
    margin: 0,
  },

  welcomeIcon: {
    width: 90,
    height: 90,
    borderRadius: 20,
    background: "rgba(255,255,255,0.15)",
    display: "grid",
    placeItems: "center",
    fontSize: 45,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--color-text)",
    margin: 0,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "var(--color-muted)",
    margin: "5px 0 0",
  },

  refreshButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    padding: "9px 15px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },

  errorBox: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 9,
    padding: 13,
    fontSize: 13,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 17,
  },

  statCard: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.035)",
    textAlign: "left",
    width: "100%",
    cursor: "pointer",
    color: "inherit",
    fontFamily: "inherit",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontSize: 23,
  },

  statArrow: {
    fontSize: 20,
    color: "var(--color-muted)",
  },

  statValue: {
    fontSize: 30,
    fontWeight: 700,
    color: "var(--color-text)",
    margin: "18px 0 4px",
  },

  statTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-text)",
    margin: "0 0 5px",
  },

  statDescription: {
    fontSize: 12,
    color: "var(--color-muted)",
  },

  quickActionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 15,
  },

  quickActionCard: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    padding: 18,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 13,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "all 0.2s ease",
  },

  quickActionIcon: {
    width: 46,
    height: 46,
    minWidth: 46,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontSize: 23,
  },

  quickActionTitle: {
    display: "block",
    color: "var(--color-text)",
    fontSize: 14,
    fontWeight: 700,
  },

  quickActionDescription: {
    color: "var(--color-muted)",
    fontSize: 11,
    margin: "5px 0 0",
  },

  quickActionArrow: {
    fontSize: 21,
    color: "var(--color-muted)",
  },

  chartSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  analyticsIcon: {
    fontSize: 27,
  },

  activityCard: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
    padding: 23,
    boxShadow: "0 4px 12px rgba(0,0,0,0.035)",
  },

  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  activityHeading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  activityMainIcon: {
    width: 45,
    height: 45,
    background: "#eff6ff",
    borderRadius: 11,
    display: "grid",
    placeItems: "center",
    fontSize: 22,
  },

  overviewTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "var(--color-text)",
    margin: 0,
  },

  overviewSubtitle: {
    fontSize: 12,
    color: "var(--color-muted)",
    margin: "5px 0 0",
  },

  emptyActivity: {
    textAlign: "center",
    padding: "35px 15px",
    background: "var(--color-background)",
    border: "1px dashed var(--color-border)",
    borderRadius: 12,
  },

  emptyActivityIcon: {
    fontSize: 35,
    marginBottom: 12,
  },

  emptyActivityTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--color-text)",
    margin: "0 0 8px",
  },

  emptyActivityText: {
    fontSize: 12,
    lineHeight: 1.7,
    color: "var(--color-muted)",
    maxWidth: 450,
    margin: "0 auto",
  },

  activityFooter: {
    borderTop: "1px solid var(--color-border)",
    paddingTop: 15,
    marginTop: 18,
    color: "var(--color-muted)",
    fontSize: 12,
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    padding: 14,
    border: "1px solid var(--color-border)",
    borderRadius: 11,
    background: "var(--color-background)",
  },

  activityEntityIcon: {
    width: 43,
    height: 43,
    minWidth: 43,
    borderRadius: 11,
    background: "#eff6ff",
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
    fontWeight: 700,
    color: "var(--color-text)",
  },

  activityDescription: {
    fontSize: 12,
    color: "var(--color-muted)",
    margin: "5px 0",
  },

  activityMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
    fontSize: 10,
    color: "var(--color-muted)",
  },

  actionBadge: {
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "capitalize",
  },

  activityError: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 9,
    padding: 12,
    fontSize: 12,
    marginBottom: 12,
  },
};
