import { create } from "zustand";
import { createDashboard, deleteDashboard, editDashboard, getDashboards } from "../api/endpoints/dashboard";

const fetchDashboardsMap = async () => {
  try {
    const result = await getDashboards();
    return createDashboardsMap(result.data.result, new Map());
  } catch (error) {
    throw error;
  }
};

const createDashboardsMap = (data, state) => {
  const result = new Map();

  data.forEach((dashboards) => {
    const { _id, name, address, socket } = dashboards;
    result.set(_id, { name, address, socket });
  });

  return new Map([...state, ...result]);
};

export const useDashboardStore = create((set, get) => ({
  dashboards: null,
  dashboard: null,
  dashboardsError: false,
  dashboardsLoading: true,
  createDashboard: async (values) => {
    try {
      set({ dashboardsLoading: true });
      const result = await createDashboard(values);
      set((state) => {
        return { dashboards: createDashboardsMap([result.data.result], state.dashboards) };
      });
    } catch (error) {
      throw error;
    } finally {
      set({ dashboardsLoading: false });
    }
  },
  initDashboards: async () => {
    try {
      set({ dashboardsLoading: true });
      const result = await fetchDashboardsMap();
      set({ dashboardsError: false, dashboards: result, dashboard: null });
    } catch (error) {
      set({ dashboardsError: true, dashboards: null, dashboard: null });
    } finally {
      set({ dashboardsLoading: false });
    }
  },
  clearDashboards: () => set({ dashboards: new Map(), dashboard: null }),
  editDashboard: async (values) => {
    try {
      set({ dashboardsLoading: true });
      const result = await editDashboard(values);
      set((state) => {
        const { _id, name, address } = result.data.result;
        const copy = Object.assign(state.dashboards);
        copy.set(_id, { name, address });
        return { dashboardsError: false, dashboards: copy };
      });
    } catch (error) {
      throw error;
    } finally {
      set({ dashboardsLoading: false });
    }
  },
  deleteDashboard: async (values) => {
    try {
      set({ dashboardsLoading: true });
      await deleteDashboard(values);
      set((state) => {
        const copy = Object.assign(state.dashboards);
        copy.delete(values._id);
        return { dashboardsError: false, dashboards: copy };
      });
    } catch (error) {
      throw error;
    } finally {
      set({ dashboardsLoading: false });
    }
  },
}));

export default useDashboardStore;
