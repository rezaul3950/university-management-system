import { apiClient } from "@/services/apiClient";

export const activityService = {
  getRecent: () => apiClient.get("/activities"),
};
