import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controllers/review.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:productId", getProductReviews);

export default router;