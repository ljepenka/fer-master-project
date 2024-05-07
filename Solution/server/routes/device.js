import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, null);
router.post("/", auth, null);
router.put("/:id", auth, null);
router.delete("/:id", auth, null);

export default router;
