
import PageHeader from "@/components/shared/PageHeader";

const stats = [
  {
    title: "Total Students",
    value: "—",
    description: "Registered students",
    icon: "🎓",
  },
  {
    title: "Total Teachers",
    value: "—",
    description: "Registered teachers",
    icon: "👨‍🏫",
  },
  {
    title: "Total Courses",
    value: "—",
    description: "Available courses",
    icon: "📚",
  },
  {
    title: "Departments",
    value: "—",
    description: "Total departments",
    icon: "🏢",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Welcome to University Management System"
      />

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 25,
        }}
      >
        {stats.map((item) => (
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
              {item.value}
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

      {/* Quick Actions */}
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
