import express from "express";
import { getDashboards, editDashboard, deleteDashboard, createDashboard } from "../controllers/dashboards.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getDashboards);
router.post("/", auth, createDashboard);
router.put("/", auth, editDashboard);
router.delete("/:id", auth, deleteDashboard);

export default router;
