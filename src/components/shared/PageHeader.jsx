export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22 }}>{title}</h1>
        {subtitle && <p style={{ margin: "4px 0 0", color: "var(--color-muted)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}