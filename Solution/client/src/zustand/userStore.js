import { jwtDecode as decoder } from "jwt-decode";
import { create } from "zustand";
import { login, register } from "../api/endpoints/auth";
import { deleteUser, editUser } from "../api/endpoints/user";

const userProperties = ["token", "email"];

const initUserData = () => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    const parsedUser = JSON.parse(user);
    const token = decoder(parsedUser.token);
    if (token.exp * 1000 < new Date().getTime()) {
      localStorage.removeItem("user");
      return null;
    }

    if (
      userProperties.every((property) => parsedUser.hasOwnProperty(property))
    ) {
      return parsedUser;
    } else {
      localStorage.removeItem("user");
      return null;
    }
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

export const useUserStore = create((set, get) => ({
  user: initUserData(),
  loginUser: async (values) => {
    try {
      const result = await login(values);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: result.data.result.email,
          token: result.data.result.token,
        })
      );
      set({ user: result.data.result });
    } catch (error) {
      throw error;
    }
  },
  initUser: () => {
    set({ user: initUserData() });
  },
  logoutUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  registerAccount: async (values) => {
    try {
      await register(values);
    } catch (error) {
      throw error;
    }
  },
  deleteAccount: async () => {
    try {
      await deleteUser();
    } catch (error) {
      throw error;
    }
  },
  editAccount: async (values) => {
    try {
      await editUser(values);
    } catch (error) {
      throw error;
    }
  },
}));

export default useUserStore;
