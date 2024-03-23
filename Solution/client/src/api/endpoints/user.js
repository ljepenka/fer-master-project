import { API } from "../axios";

export const getUser = () => API.get("/users");

export const deleteUser = () => API.delete("/users");

export const editUser = (editData) => API.put("/users", editData);
