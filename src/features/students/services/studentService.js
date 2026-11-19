
import { apiClient } from "@/services/apiClient";

export const studentService = {
  getAll: (query = "") => apiClient.get(`/students${query}`),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (payload) => apiClient.post("/students", payload),
  update: (id, payload) => apiClient.put(`/students/${id}`, payload),
  remove: (id) => apiClient.delete(`/students/${id}`),

  // Get monthly student enrollment
  getMonthlyEnrollment: () =>
    apiClient.get("/students/enrollment/monthly"),
};
