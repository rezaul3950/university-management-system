import { apiClient } from "@/services/apiClient";

export const departmentService = {
  getAll: (query = "") => apiClient.get(`/departments${query}`),

  getById: (id) => apiClient.get(`/departments/${id}`),

  create: (payload) => apiClient.post("/departments", payload),

  update: (id, payload) => apiClient.put(`/departments/${id}`, payload),

  remove: (id) => apiClient.delete(`/departments/${id}`),
};