export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

export const STORAGE_KEYS = {
  TOKEN: "ums_token",
  USER: "ums_user",
};

export const ROLE_HOME = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.TEACHER]: "/teacher/dashboard",
  [ROLES.STUDENT]: "/student/dashboard",
};