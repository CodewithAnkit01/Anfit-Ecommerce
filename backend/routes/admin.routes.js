import express from "express";
import { getStats } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getStats);

export default router;