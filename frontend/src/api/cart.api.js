import api from "./axios";

// ADD TO CART
export const addToCart = (data) =>
  api.post("/cart", data);

// GET USER CART
export const getCart = () =>
  api.get("/cart");

// REMOVE CART ITEM
export const removeFromCart = (id) =>
  api.delete(`/cart/${id}`);

export const updateCartQuantity = (
  id,
  quantity
) =>
  api.put(`/cart/${id}`, {
    quantity,
  });