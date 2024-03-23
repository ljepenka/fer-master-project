import express from "express";
import { deleteProfile, editProfile, getProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, editProfile);
router.delete("/", auth, deleteProfile);

export default router;
