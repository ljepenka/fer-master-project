import { create } from "zustand";
import {
    createDevice,
    deleteDevice,
    editDevice,
    getDevices,
} from "../api/endpoints/device";

const fetchDevicesMap = async () => {
  try {
    const result = await getDevices();
    return createDevicesMap(result.data.result, new Map());
  } catch (error) {
    throw error;
  }
};

const createDevicesMap = (data, state) => {
  const result = new Map();

  data.forEach((devices) => {
    const { _id, name, address, socket, dashboard, params } = devices;
    result.set(_id, { name, address, socket, dashboard, params });
  });

  return new Map([...state, ...result]);
};

export const useDeviceStore = create((set, get) => ({
  devices: null,
  device: null,
  devicesError: false,
  devicesLoading: true,
  createDevice: async (dashboardId, values) => {
    try {
      set({ devicesLoading: true });
      const result = await createDevice(dashboardId, values);
      set((state) => {
        return {
          devices: createDevicesMap([result.data.result], state.devices),
        };
      });

      return result;
    } catch (error) {
      throw error;
    } finally {
      set({ devicesLoading: false });
    }
  },
  initDevices: async () => {
    try {
      set({ devicesLoading: true });
      const result = await fetchDevicesMap();
      set({ devicesError: false, devices: result, device: null });
    } catch (error) {
      set({ devicesError: true, devices: null, device: null });
    } finally {
      set({ devicesLoading: false });
    }
  },
  clearDevices: () => set({ devices: new Map(), device: null }),
  editDevice: async (dashboardId, values) => {
    try {
      set({ devicesLoading: true });
      const result = await editDevice(dashboardId, values);
      set((state) => {
        const { _id, name, address } = result.data.result;
        const copy = Object.assign(state.devices);
        copy.set(_id, { name, address });
        return { devicesError: false, devices: copy };
      });
    } catch (error) {
      throw error;
    } finally {
      set({ devicesLoading: false });
    }
  },
  deleteDevice: async (dashboardId, values) => {
    try {
      set({ devicesLoading: true });
      await deleteDevice(dashboardId, values);
      set((state) => {
        const copy = Object.assign(state.devices);
        copy.delete(values._id);
        return { devicesError: false, devices: copy };
      });
    } catch (error) {
      throw error;
    } finally {
      set({ devicesLoading: false });
    }
  },
}));

export default useDeviceStore;
