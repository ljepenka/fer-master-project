import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../endpoints/dashboard";

export const useGetDashboardByIdQuery = (dashboardName) => {
  return useQuery({
    queryKey: ["dashboards", dashboardName],
    queryFn: () => getDashboard(dashboardName),
    enabled: Boolean(dashboardName),
    retry: false,
  });
};
