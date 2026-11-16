export default function Loader({ text = "Loading..." }) {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "var(--color-muted)" }}>
      {text}
    </div>
  );
}