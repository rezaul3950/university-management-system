
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { navLinks } from "@/routes/routeConfig";
import { config } from "@/app/config";

import {
  LayoutDashboard,
  Users,
  UserRound,
  Building2,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Megaphone,
  GraduationCap,
  UserCircle,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";

const menuIcons = {
  Dashboard: LayoutDashboard,
  Students: Users,
  Teachers: UserRound,
  Departments: Building2,
  Courses: BookOpen,
  Attendance: CalendarCheck,
  Results: ClipboardList,
  Notices: Megaphone,
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = navLinks[user?.role] || [];

  return (
    <aside
      style={{
        width: 270,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1220 0%, #111c32 55%, #0b1220 100%)",
        color: "#fff",
        padding: "24px 16px 18px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        borderRight: "1px solid rgba(96,165,250,0.12)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* BRAND */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "3px 8px 25px",
          borderBottom: "1px solid rgba(148,163,184,0.13)",
          marginBottom: 27,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            flexShrink: 0,
            borderRadius: 15,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 7px 22px rgba(37,99,235,0.35)",
          }}
        >
          <GraduationCap size={29} color="#fff" strokeWidth={2.2} />
        </div>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              fontSize: 15,
              margin: 0,
              fontWeight: 800,
              letterSpacing: "-0.4px",
              color: "#f8fafc",
            }}
          >
            {config.appName}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#38bdf8",
                boxShadow: "0 0 8px #38bdf8",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "#94a3b8",
              }}
            >
              UNIVERSITY PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* MENU TITLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          marginBottom: 13,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#64748b",
            letterSpacing: 1.8,
          }}
        >
          MAIN MENU
        </span>

        <Sparkles size={13} color="#3b82f6" />
      </div>

      {/* NAVIGATION */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        {links.map((link) => {
          const Icon = menuIcons[link.label] || LayoutDashboard;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "13px 14px",
                borderRadius: 12,
                textDecoration: "none",
                color: isActive ? "#ffffff" : "#94a3b8",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                background: isActive
                  ? "linear-gradient(100deg, #2563eb 0%, #1d4ed8 100%)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(96,165,250,0.45)"
                  : "1px solid transparent",
                boxShadow: isActive
                  ? "0 5px 18px rgba(37,99,235,0.25)"
                  : "none",
                transition: "all 0.22s ease",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.getAttribute("aria-current")) {
                  e.currentTarget.style.background = "rgba(59,130,246,0.10)";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateX(3px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute("aria-current")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <Icon size={19} strokeWidth={2.1} />

              <span style={{ flex: 1 }}>{link.label}</span>

              {link.label === "Dashboard" && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#bfdbfe",
                    boxShadow: "0 0 8px #bfdbfe",
                  }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM SETTINGS */}
      <div
        style={{
          borderTop: "1px solid rgba(148,163,184,0.13)",
          paddingTop: 17,
          marginTop: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 12px",
            borderRadius: 12,
            background: "rgba(30,41,59,0.65)",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <div
            style={{
              width: 39,
              height: 39,
              flexShrink: 0,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserCircle size={25} color="#fff" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 700,
                color: "#f8fafc",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || "User"}
            </p>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: 10,
                color: "#60a5fa",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {user?.role || "Member"}
            </p>
          </div>

          <ChevronRight size={16} color="#64748b" />
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: 9,
            margin: "16px 0 0",
            letterSpacing: 1,
          }}
        >
          UNIVERSITY MANAGEMENT SYSTEM
        </p>
      </div>
    </aside>
  );
}
