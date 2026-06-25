import api from "./axios";

// CHECKOUT
export const checkout = (data) =>
  api.post("/orders/checkout", data);

// USER ORDERS
export const getUserOrders = (userId) =>
  api.get(`/orders/user/${userId}`);

// MY ORDERS
export const getMyOrders = () =>
  api.get("/orders/my-orders");

// ADMIN ORDERS
export const getAllOrders = () =>
  api.get("/orders");

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}`, { status });