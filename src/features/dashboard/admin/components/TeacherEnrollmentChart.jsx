
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  BriefcaseBusiness,
  TrendingUp,
  Users,
} from "lucide-react";

import { teacherService } from "@/features/teachers/services/teacherService";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={styles.tooltip}>
      <span style={styles.tooltipLabel}>{label}</span>
      <strong>{payload[0].value} Teachers</strong>
    </div>
  );
}

export default function TeacherEnrollmentChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await teacherService.getMonthlyEnrollment();
        const enrollment = response.enrollment || [];

        const yearlyData = enrollment.filter(
          (item) => item._id.year === year
        );

        setData(
          months.map((month, index) => {
            const found = yearlyData.find(
              (item) => item._id.month === index + 1
            );

            return {
              month,
              teachers: found?.totalTeachers || 0,
            };
          })
        );
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const total = data.reduce(
    (sum, item) => sum + item.teachers,
    0
  );

  const peak = data.reduce(
    (max, item) =>
      item.teachers > max.teachers ? item : max,
    { month: "-", teachers: 0 }
  );

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headingLeft}>
          <div style={styles.iconBox}>
            <BriefcaseBusiness size={17} color="#7C3AED" />
          </div>

          <div>
            <h3 style={styles.title}>Teacher Enrollment</h3>
            <p style={styles.subtitle}>
              Monthly recruitment · {year}
            </p>
          </div>
        </div>

        <span style={styles.yearBadge}>{year}</span>
      </div>

      {/* Statistics */}
      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statIcon}>
            <Users size={13} color="#7C3AED" />
          </div>

          <div>
            <span style={styles.statLabel}>Total Teachers</span>
            <strong style={styles.statValue}>
              {loading ? "..." : total.toLocaleString()}
            </strong>
          </div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>
            <TrendingUp size={13} color="#7C3AED" />
          </div>

          <div>
            <span style={styles.statLabel}>Peak Month</span>
            <strong style={styles.statValue}>
              {loading ? "..." : peak.teachers}
              {!loading && peak.teachers > 0 && (
                <small style={styles.peakMonth}>
                  {" "}· {peak.month}
                </small>
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div style={styles.chartBox}>
        <div style={styles.chartHeader}>
          <div>
            <span style={styles.chartTitle}>
              Teacher Growth Trend
            </span>
            <p style={styles.chartSubtitle}>
              Monthly teacher registration
            </p>
          </div>

          <span style={styles.legend}>
            <i style={styles.legendDot} />
            Teachers
          </span>
        </div>

        {loading ? (
          <div style={styles.message}>
            Loading enrollment data...
          </div>
        ) : error ? (
          <div style={{ ...styles.message, color: "#DC2626" }}>
            {error}
          </div>
        ) : (
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 8,
                  right: 5,
                  left: -25,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="teacherAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8B5CF6"
                      stopOpacity={0.42}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6366F1"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#C9D8EB"
                  strokeDasharray="3 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 9 }}
                  dy={5}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 9 }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#8B5CF6",
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="teachers"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fill="url(#teacherAreaGradient)"
                  activeDot={{
                    r: 5,
                    fill: "#C4B5FD",
                    stroke: "#6D28D9",
                    strokeWidth: 2,
                  }}
                  dot={false}
                  animationDuration={1100}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <span style={styles.liveDot} />
        Live data from teacher records
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "linear-gradient(145deg, #E2ECFA, #DCE8F7)",
    border: "1px solid #C7D8EE",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: "#172554",
    minWidth: 0,
    boxShadow: "0 5px 15px rgba(37,99,235,0.07)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },

  headingLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },

  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "#D2E3F8",
    border: "1px solid #B8D0EF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "#172554",
  },

  subtitle: {
    margin: "3px 0 0",
    fontSize: 10,
    color: "#526783",
  },

  yearBadge: {
    padding: "4px 8px",
    borderRadius: 6,
    background: "#D2E3F8",
    border: "1px solid #B8D0EF",
    color: "#1D4ED8",
    fontSize: 10,
    fontWeight: 700,
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    marginBottom: 10,
  },

  stat: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 9px",
    borderRadius: 8,
    background: "#F1F6FD",
    border: "1px solid #D0DFF0",
    minWidth: 0,
  },

  statIcon: {
    width: 25,
    height: 25,
    borderRadius: 7,
    background: "#DFEBFA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statLabel: {
    display: "block",
    color: "#526783",
    fontSize: 9,
    marginBottom: 3,
  },

  statValue: {
    display: "block",
    color: "#172554",
    fontSize: 16,
    fontWeight: 700,
  },

  peakMonth: {
    color: "#7C3AED",
    fontSize: 10,
    fontWeight: 500,
  },

  chartBox: {
    background: "#EDF3FB",
    border: "1px solid #CAD9EC",
    borderRadius: 9,
    padding: "9px 8px 4px",
    minWidth: 0,
  },

  chartHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 3,
  },

  chartTitle: {
    color: "#172554",
    fontSize: 10,
    fontWeight: 600,
  },

  chartSubtitle: {
    margin: "3px 0 0",
    color: "#526783",
    fontSize: 9,
  },

  legend: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "#526783",
    fontSize: 9,
  },

  legendDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#8B5CF6",
  },

  tooltip: {
    background: "#F8FAFF",
    border: "1px solid #B8D0EF",
    borderRadius: 7,
    padding: "7px 10px",
    color: "#172554",
    fontSize: 11,
    boxShadow: "0 5px 15px rgba(15,23,42,0.10)",
  },

  tooltipLabel: {
    display: "block",
    color: "#526783",
    marginBottom: 4,
  },

  message: {
    height: 130,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#526783",
    fontSize: 11,
  },

  footer: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 9,
    color: "#526783",
    fontSize: 9,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22C55E",
  },
};
