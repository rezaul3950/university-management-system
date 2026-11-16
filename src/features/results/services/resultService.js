import { apiClient } from "@/services/apiClient";

export const resultService = {
  getAll: (query = "") => apiClient.get(`/results${query}`),
  getById: (id) => apiClient.get(`/results/${id}`),
  create: (payload) => apiClient.post("/results", payload),
  update: (id, payload) => apiClient.put(`/results/${id}`, payload),
  remove: (id) => apiClient.delete(`/results/${id}`),
};