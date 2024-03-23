import { API } from "../axios";

export const getDashboards = () => API.get("/dashboards");

export const getDashboard = (dashboardName) => API.get(`/dashboards/${dashboardName}`);

export const createDashboard = (dashboardData) => API.post("/dashboards", dashboardData);

export const editDashboard = (dashboardData) => API.put(`/dashboards`, dashboardData);

export const deleteDashboard = (dashboardData) => API.delete(`/dashboards/${dashboardData._id}`);
