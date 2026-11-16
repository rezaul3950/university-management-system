import { useState } from "react";

export default function NotificationPanel({ notifications = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Notifications" style={{ border: "none", background: "none", cursor: "pointer", fontSize: 14 }}>
        Notifications ({notifications.length})
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "100%", width: 260, padding: 12, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius)", zIndex: 20 }}>
          {notifications.length === 0 ? (
            <span style={{ color: "var(--color-muted)", fontSize: 14 }}>No new notifications</span>
          ) : (
            notifications.map((n) => <p key={n.id} style={{ margin: "4px 0", fontSize: 14 }}>{n.message}</p>)
          )}
        </div>
      )}
    </div>
  );
}