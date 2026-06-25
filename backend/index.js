  import express from "express";

  import dotenv from "dotenv";

  dotenv.config();

  const app = express();
  import cors from "cors";
  app.use("/uploads", express.static("uploads"));

  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.json({ message: "Backend is working 🚀" });
  });

  const PORT = process.env.PORT || 5000;

  import authRoutes from "./routes/auth.routes.js";
  import productRoutes from "./routes/product.routes.js";
  import cartRoutes from "./routes/cart.routes.js";
  import orderRoutes from "./routes/order.routes.js";
  import userRoutes from "./routes/user.routes.js";
  import reviewRoutes from "./routes/review.routes.js";
  import wishlistRoutes from "./routes/wishlist.routes.js";
  import adminRoutes from "./routes/admin.routes.js";
  import paymentRoutes from "./routes/payment.routes.js";




  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/payment", paymentRoutes);






  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });