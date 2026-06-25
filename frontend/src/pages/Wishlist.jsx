import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import { addToCart } from "../api/cart.api";

import Loader from "../components/Loader";
import { getWishlist, removeFromWishlist } from "../api/wishlist.api";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

const fetchWishlist = async () => {
  try {
    setLoading(true);

    const res = await getWishlist();

    setWishlist(res.data);
  } catch (error) {
    toast.error("Failed to load wishlist");
  } finally {
    setLoading(false);
  }
};

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);

      setWishlist((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (id, stock) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }
  
    if (stock <= 0) {
      toast.error("Out of stock product");
      return;
    }
  
    try {
      setLoadingCart(true);
  
      await addToCart({
        productId: id,
        quantity: 1,
      });
  
      toast.success("Added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setLoadingCart(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <Heart className="text-red-500" size={32} />
          <div>
            <h1 className="text-3xl font-bold">
              My Wishlist
            </h1>
            <p className="text-gray-500">
              {wishlist.length} saved products
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <Heart
              size={70}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Save products you love and find them here.
            </p>

            <a
              href="/products"
              className="inline-flex bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
            >
              Explore Products
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

            {wishlist.map((item) => (
              <div
              onClick={() => navigate(`/products/${item.product.id}`)}
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.nameUrl}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.product.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 h-10">
                    {item.product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      Rs. {item.product.price}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3">

                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item.product.id, item.product.stock);
                      }}
                      className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900"
                    >
                      <ShoppingCart size={18} />
                      Add Cart
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id)}}
                      className="w-12 h-12 flex items-center justify-center border rounded-xl hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2
                        size={18}
                        className="text-red-500"
                      />
                    </button>

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}