import api from "./axios";

// GET ALL PRODUCTS
export const getProducts = () =>
  api.get("/products");

// GET SINGLE PRODUCT
export const getProductById = (id) =>
  api.get(`/products/${id}`);

// GET TRENDING PRODUCTS
export const getTrendingProducts = () =>
  api.get("/products/trending");

// CREATE PRODUCT
export const createProduct = (data) =>
  api.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// UPDATE PRODUCT
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// DELETE PRODUCT
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);