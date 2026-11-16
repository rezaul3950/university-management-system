import { ROLES } from "@/utils/constants";

export const navLinks = {
  [ROLES.ADMIN]: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Students", to: "/admin/students" },
    { label: "Teachers", to: "/admin/teachers" },
    { label: "Courses", to: "/admin/courses" },
    { label: "Attendance", to: "/admin/attendance" },
    { label: "Results", to: "/admin/results" },
    { label: "Notices", to: "/admin/notices" },
  ],
  [ROLES.TEACHER]: [
    { label: "Dashboard", to: "/teacher/dashboard" },
    { label: "Courses", to: "/teacher/courses" },
    { label: "Attendance", to: "/teacher/attendance" },
    { label: "Results", to: "/teacher/results" },
    { label: "Notices", to: "/teacher/notices" },
  ],
  [ROLES.STUDENT]: [
    { label: "Dashboard", to: "/student/dashboard" },
    { label: "Courses", to: "/student/courses" },
    { label: "Attendance", to: "/student/attendance" },
    { label: "Results", to: "/student/results" },
    { label: "Notices", to: "/student/notices" },
  ],
};