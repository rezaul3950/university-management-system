import { apiClient } from "@/services/apiClient";

export const teacherService = {
  getAll: (query = "") => apiClient.get(`/teachers${query}`),
  getById: (id) => apiClient.get(`/teachers/${id}`),
  create: (payload) => apiClient.post("/teachers", payload),
  update: (id, payload) => apiClient.put(`/teachers/${id}`, payload),
  remove: (id) => apiClient.delete(`/teachers/${id}`),
};