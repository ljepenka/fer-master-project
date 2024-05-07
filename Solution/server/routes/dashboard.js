import express from "express";
import { createDashboard, deleteDashboard, editDashboard, getDashboard, getDashboards } from "../controllers/dashboards.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getDashboards);
router.get("/:id", auth, getDashboard);
router.post("/", auth, createDashboard);
router.put("/:id", auth, editDashboard);
router.delete("/:id", auth, deleteDashboard);

export default router;
