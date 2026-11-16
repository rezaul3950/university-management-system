const colors = {
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
  info: "var(--color-primary)",
};

export default function Badge({ children, tone = "info" }) {
  return (
    <span
      style={{
        background: colors[tone],
        color: "#fff",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
      }}
    >
      {children}
    </span>
  );
}