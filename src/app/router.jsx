import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLES, ROLE_HOME } from "@/utils/constants";

import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleBasedRoute from "@/routes/RoleBasedRoute";

import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import TeacherLayout from "@/layouts/TeacherLayout";
import StudentLayout from "@/layouts/StudentLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import AdminDashboard from "@/features/dashboard/admin/AdminDashboard";
import TeacherDashboard from "@/features/dashboard/teacher/TeacherDashboard";
import StudentDashboard from "@/features/dashboard/student/StudentDashboard";
import StudentListPage from "@/features/students/pages/StudentListPage";
import TeacherListPage from "@/features/teachers/pages/TeacherListPage";
import CourseListPage from "@/features/courses/pages/CourseListPage";
import AttendancePage from "@/features/attendance/pages/AttendancePage";
import ResultsPage from "@/features/results/pages/ResultsPage";
import NoticesPage from "@/features/notices/pages/NoticesPage";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentListPage />} />
              <Route path="teachers" element={<TeacherListPage />} />
              <Route path="courses" element={<CourseListPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="notices" element={<NoticesPage />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[ROLES.TEACHER]} />}>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<CourseListPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="notices" element={<NoticesPage />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[ROLES.STUDENT]} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CourseListPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="notices" element={<NoticesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}