import express from "express";
import {
  initiateEsewaPayment,
  paymentSuccess,
  paymentFailure,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/esewa", initiateEsewaPayment);
router.get("/success/:id", paymentSuccess);
router.get("/failure/:id", paymentFailure);

export default router;