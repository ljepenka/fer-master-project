import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../endpoints/dashboard";

export const useGetDashboardByIdQuery = (dashboardId) => {
  return useQuery({
    queryKey: ["dashboards", dashboardId],
    queryFn: () => getDashboard(dashboardId),
    enabled: Boolean(dashboardId),
    retry: false,
  });
};
