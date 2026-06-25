import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);
router.put("/:id", protect, updateCartQuantity);

export default router;