  import express from "express";
  import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getTrendingProducts,
    
  } from "../controllers/product.controller.js";
  import { protect } from "../middleware/auth.middleware.js";
  import { upload } from "../middleware/multer.middleware.js";

  import {isAdmin} from "../middleware/admin.middleware.js";
  const router = express.Router();

 router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateProduct
);
  router.get("/",  getProducts);
  router.get("/trending", getTrendingProducts);
  router.get("/:id",  getProductById);
 

  router.delete(
    "/:id",
    protect,
    isAdmin,
    deleteProduct
  );

  

  export default router;