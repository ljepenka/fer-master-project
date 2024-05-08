import { API } from "../axios";

export const getDevices = (dashboardId) => API.get(`/dashboards/${dashboardId}/devices`);

export const createDevice = (dashboardId, deviceData) => API.post(`/dashboards/${dashboardId}/devices`, deviceData);

export const editDevice = (dashboardId, deviceData) => API.put(`/dashboards/${dashboardId}/devices/${deviceData._id}`, deviceData);

export const deleteDevice = (dashboardId, deviceData) => API.delete(`/dashboards/${dashboardId}/devices/${deviceData._id}`);
