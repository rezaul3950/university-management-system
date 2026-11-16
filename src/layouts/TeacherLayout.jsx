import { Outlet } from "react-router-dom";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";

export default function TeacherLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}