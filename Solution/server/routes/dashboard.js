import express from "express";
import {
  createDashboard,
  deleteDashboard,
  editDashboard,
  getDashboard,
  getDashboards,
} from "../controllers/dashboards.js";
import {
  createDevice,
  deleteDevice,
  editDevice,
  getDevices,
} from "../controllers/device.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getDashboards);
router.get("/:id", auth, getDashboard);
router.post("/", auth, createDashboard);
router.put("/:id", auth, editDashboard);
router.delete("/:id", auth, deleteDashboard);
router.get("/:dashboardId/devices", auth, getDevices);
router.post("/:dashboardId/devices", auth, createDevice);
router.put("/:dashboardId/devices/:id", auth, editDevice);
router.delete("/:dashboardId/devices/:id", auth, deleteDevice);

export default router;
