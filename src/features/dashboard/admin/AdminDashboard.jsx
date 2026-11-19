
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

import { studentService } from "@/features/students/services/studentService";
import { teacherService } from "@/features/teachers/services/teacherService";
import { courseService } from "@/features/courses/services/courseService";
import { departmentService } from "@/features/departments/services/departmentService";

import StudentEnrollmentChart from "./components/StudentEnrollmentChart";
import TeacherEnrollmentChart from "./components/TeacherEnrollmentChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: "—",
    teachers: "—",
    courses: "—",
    departments: "—",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
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

        setStats({
          students:
            studentData.count ?? studentData.students?.length ?? 0,

          teachers:
            teacherData.count ?? teacherData.teachers?.length ?? 0,

          courses: Array.isArray(courseData.data)
            ? courseData.data.length
            : 0,

          departments:
            departmentData.count ??
            departmentData.departments?.length ??
            0,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.students,
      description: "Registered students",
      icon: "🎓",
    },
    {
      title: "Total Teachers",
      value: stats.teachers,
      description: "Registered teachers",
      icon: "👨‍🏫",
    },
    {
      title: "Total Courses",
      value: stats.courses,
      description: "Available courses",
      icon: "📚",
    },
    {
      title: "Departments",
      value: stats.departments,
      description: "Total departments",
      icon: "🏢",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Welcome to University Management System"
      />

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 25,
        }}
      >
        {statCards.map((item) => (
          <div
            key={item.title}
            style={{
              background: "var(--color-surface)",
              padding: 22,
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "var(--color-muted)" }}>
                {item.title}
              </span>

              <span style={{ fontSize: 25 }}>
                {item.icon}
              </span>
            </div>

            <h2 style={{ fontSize: 30, margin: "15px 0 5px" }}>
              {loading ? "..." : item.value}
            </h2>

            <p
              style={{
                margin: 0,
                color: "var(--color-muted)",
                fontSize: 13,
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Student Enrollment Chart */}
      <StudentEnrollmentChart />

      {/* Teacher Enrollment Chart */}
      <TeacherEnrollmentChart />

      {/* Quick Overview */}
      <div
        style={{
          background: "var(--color-surface)",
          padding: 22,
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Quick Overview</h3>

        <p style={{ color: "var(--color-muted)" }}>
          Welcome to the Admin Dashboard. From here,
          you will be able to manage students, teachers,
          courses and departments.
        </p>
      </div>
    </div>
  );
}
