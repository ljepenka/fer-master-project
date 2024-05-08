import { useQuery } from "@tanstack/react-query";
import { getDevices } from "../endpoints/device";

export const useGetDashboardDevicesQuery = (dashboardId) => {
  return useQuery({
    queryKey: ["dashboards", "devices", dashboardId],
    queryFn: () => getDevices(dashboardId),
    enabled: Boolean(dashboardId),
    retry: false,
  });
};
