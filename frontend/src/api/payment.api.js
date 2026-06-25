import api from "./axios";

export const initiateEsewaPayment = (data) =>
  api.post("/payment/esewa", data);