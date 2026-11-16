export default function AttendanceChart({ data = [] }) {
  const max = Math.max(100, ...data.map((d) => d.value));

  return (
    <div style={{ background: "var(--color-surface)", padding: 16, borderRadius: "var(--radius)" }}>
      <h3 style={{ marginTop: 0 }}>Attendance (%)</h3>
      {data.length === 0 && <p style={{ color: "var(--color-muted)" }}>No data</p>}
      {data.map((d) => (
        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ width: 70, fontSize: 13 }}>{d.label}</span>
          <div style={{ flex: 1, background: "var(--color-border)", borderRadius: 4 }}>
            <div style={{ width: `${(d.value / max) * 100}%`, background: "var(--color-success)", height: 12, borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 13 }}>{d.value}%</span>
        </div>
      ))}
    </div>
  );
}