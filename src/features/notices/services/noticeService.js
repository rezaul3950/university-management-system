import { apiClient } from "@/services/apiClient";

export const noticeService = {
  getAll: (query = "") => apiClient.get(`/notices${query}`),
  getById: (id) => apiClient.get(`/notices/${id}`),
  create: (payload) => apiClient.post("/notices", payload),
  update: (id, payload) => apiClient.put(`/notices/${id}`, payload),
  remove: (id) => apiClient.delete(`/notices/${id}`),
};