import express from "express";
import { getProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

export default router;