
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import Dropdown from "@/components/ui/Dropdown";
import NotificationPanel from "./NotificationPanel";
import { capitalize } from "@/utils/helpers";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = capitalize(user?.role || "Admin");
  const name = user?.name || "User";

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.statusIcon}>
          <Sparkles size={17} />
        </div>
        <div>
          <div style={styles.welcome}>UNIVERSITY MANAGEMENT</div>
          <div style={styles.subtitle}>Management Portal</div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.notification}>
          <NotificationPanel />
        </div>

        <div style={styles.divider} />

        <Dropdown
          trigger={
            <div style={styles.profile}>
              <div style={styles.avatar}>
                {name.charAt(0).toUpperCase()}
              </div>

              <div style={styles.profileInfo}>
                <span style={styles.profileName}>{name}</span>
                <span style={styles.profileRole}>
                  <ShieldCheck size={12} />
                  {role}
                </span>
              </div>

              <ChevronDown size={16} color="#64748b" />
            </div>
          }
          items={[
            {
              label: "Logout",
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </header>
  );
}

const styles = {
  header: {
    minHeight: 76,
    padding: "12px 28px",
    background: "#ffffff",
    borderBottom: "1px solid #e8edf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxShadow: "0 3px 15px rgba(15, 35, 75, 0.04)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563eb",
    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  },

  welcome: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.1,
    color: "#64748b",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 600,
    color: "#172554",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  notification: {
    display: "flex",
    alignItems: "center",
  },

  divider: {
    width: 1,
    height: 38,
    background: "#e2e8f0",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "7px 11px",
    border: "1px solid #e8edf5",
    borderRadius: 13,
    background: "#f8faff",
    cursor: "pointer",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 800,
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    minWidth: 75,
  },

  profileName: {
    fontSize: 13,
    fontWeight: 800,
    color: "#172554",
  },

  profileRole: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
  },
};
