import { formatCurrency } from "@/utils/helpers";

export default function RevenueChart({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.amount));

  return (
    <div style={{ background: "var(--color-surface)", padding: 16, borderRadius: "var(--radius)" }}>
      <h3 style={{ marginTop: 0 }}>Revenue</h3>
      {data.length === 0 && <p style={{ color: "var(--color-muted)" }}>No data</p>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
        {data.map((d) => (
          <div key={d.label} style={{ flex: 1, textAlign: "center" }} title={formatCurrency(d.amount)}>
            <div style={{ height: `${(d.amount / max) * 130}px`, background: "var(--color-primary)", borderRadius: 4 }} />
            <span style={{ fontSize: 12 }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}