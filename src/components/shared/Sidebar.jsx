import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { navLinks } from "@/routes/routeConfig";
import { config } from "@/app/config";

export default function Sidebar() {
  const { user } = useAuth();
  const links = navLinks[user?.role] || [];

  return (
    <aside style={{ width: 230, background: "var(--color-primary-dark)", color: "#fff", padding: 16, minHeight: "100vh" }}>
      <h2 style={{ fontSize: 16, marginTop: 0 }}>{config.appName}</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              color: "#fff",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "var(--radius)",
              background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}