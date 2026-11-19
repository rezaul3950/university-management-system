
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { teacherService } from "@/features/teachers/services/teacherService";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

export default function TeacherEnrollmentChart() {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await teacherService.getMonthlyEnrollment();

        const enrollment = response.enrollment || [];

        const currentYear = new Date().getFullYear();

        const currentYearData = enrollment.filter(
          (item) => item._id.year === currentYear
        );

        const formattedData = monthNames.map((month, index) => {
          const monthData = currentYearData.find(
            (item) => item._id.month === index + 1
          );

          return {
            month,
            teachers: monthData ? monthData.totalTeachers : 0,
          };
        });

        setEnrollmentData(formattedData);
      } catch (err) {
        setError(err.message || "Failed to load teacher enrollment data");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, []);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        padding: 22,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        marginBottom: 25,
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        Teacher Enrollment Overview
      </h3>

      <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
        Monthly teacher registration - {new Date().getFullYear()}
      </p>

      {loading ? (
        <p>Loading teacher enrollment data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="teachers"
                fill="#0d9488"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
