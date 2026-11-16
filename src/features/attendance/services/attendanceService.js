import { apiClient } from "@/services/apiClient";

export const attendanceService = {
  getAll: (query = "") => apiClient.get(`/attendance${query}`),
  getById: (id) => apiClient.get(`/attendance/${id}`),
  create: (payload) => apiClient.post("/attendance", payload),
  update: (id, payload) => apiClient.put(`/attendance/${id}`, payload),
  remove: (id) => apiClient.delete(`/attendance/${id}`),
};