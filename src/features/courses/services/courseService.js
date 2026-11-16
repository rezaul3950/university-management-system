import { apiClient } from "@/services/apiClient";

export const courseService = {
  getAll: (query = "") => apiClient.get(`/courses${query}`),
  getById: (id) => apiClient.get(`/courses/${id}`),
  create: (payload) => apiClient.post("/courses", payload),
  update: (id, payload) => apiClient.put(`/courses/${id}`, payload),
  remove: (id) => apiClient.delete(`/courses/${id}`),
};