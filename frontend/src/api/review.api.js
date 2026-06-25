import api from "./axios";

// CREATE REVIEW
export const createReview = (data) =>
  api.post("/reviews", data);

// PRODUCT REVIEWS
export const getProductReviews = (productId) =>
  api.get(`/reviews/${productId}`);