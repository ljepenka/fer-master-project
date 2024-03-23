import { create } from "zustand";

export const useNavbarStore = create((set, get) => ({
  open: false,
  openNavbar: () => {
    set({ open: true });
  },
  closeNavbar: () => {
    set({ open: false });
  },
}));

export default useNavbarStore;
