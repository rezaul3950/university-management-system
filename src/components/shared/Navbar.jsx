import { useNavigate } from "react-router-dom";
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

  return (
    <header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, padding: "12px 24px", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
      <NotificationPanel />
      <Dropdown
        trigger={<span>{user?.name || "User"} ({capitalize(user?.role)})</span>}
        items={[{ label: "Logout", onClick: handleLogout }]}
      />
    </header>
  );
}