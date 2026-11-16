export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius)",
          padding: 24,
          minWidth: 360,
          maxWidth: "90vw",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer" }}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}