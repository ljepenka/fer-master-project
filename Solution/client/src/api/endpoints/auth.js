import { API } from "../axios";

export const login = (loginData) => API.post("/auth/login", loginData);

export const register = (registerData) => API.post("/auth/register", registerData);
