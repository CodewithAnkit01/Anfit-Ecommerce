import express from "express";
import {
  checkout,
  getUserOrders,
  getAllOrders,
  getMyOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {isAdmin} from "../middleware/admin.middleware.js";


const router = express.Router();

router.post("/checkout", protect, checkout);
router.get("/user/:userId", protect, getUserOrders);
router.get("/", protect, isAdmin, getAllOrders);
 router.get("/my-orders", protect, getMyOrders);
 router.put(
  "/:id",
  protect,
  isAdmin,
  updateOrderStatus
);

export default router;