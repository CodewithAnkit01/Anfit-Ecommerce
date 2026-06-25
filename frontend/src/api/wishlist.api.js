    import api from "./axios";

    // ADD TO WISHLIST
    export const addToWishlist = (data) =>
    api.post("/wishlist", data);

    // GET WISHLIST
    export const getWishlist = () =>
    api.get("/wishlist");

    // REMOVE FROM WISHLIST
    export const removeFromWishlist = (id) =>
    api.delete(`/wishlist/${id}`);