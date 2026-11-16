export default function Input({ label, error, id, style, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 14, fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          padding: "8px 12px",
          border: `1px solid ${error ? "var(--color-danger)" : "var(--color-border)"}`,
          borderRadius: "var(--radius)",
          fontSize: 14,
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ color: "var(--color-danger)", fontSize: 12 }}>{error}</span>}
    </div>
  );
}