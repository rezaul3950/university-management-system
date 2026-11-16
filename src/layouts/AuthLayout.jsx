import { Outlet } from "react-router-dom";
import { config } from "@/app/config";

export default function AuthLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--color-surface)", padding: 32, borderRadius: "var(--radius)", width: 380 }}>
        <h2 style={{ marginTop: 0, textAlign: "center" }}>{config.appName}</h2>
        <Outlet />
      </div>
    </div>
  );
}