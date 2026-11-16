import { useEffect, useRef, useState } from "react";

export default function Dropdown({ trigger, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen((o) => !o)} style={{ cursor: "pointer" }}>
        {trigger}
      </div>
      {open && (
        <ul
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            margin: 0,
            padding: 4,
            listStyle: "none",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            minWidth: 150,
            zIndex: 20,
          }}
        >
          {items.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "none", cursor: "pointer" }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}