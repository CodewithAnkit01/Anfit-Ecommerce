import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

import Loader from "../components/Loader";

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../api/cart.api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await getCart();

      setCart(res.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);

      setCart((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantity = async (
    id,
    quantity
  ) => {
    try {
      await updateCartQuantity(id, quantity);

      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
              }
            : item
        )
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  };

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + (item.quantity || 1),
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.product.price *
        (item.quantity || 1),
    0
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Your Cart
              </h1>

              <p className="text-gray-500 mt-1">
                {totalItems} item
                {totalItems !== 1 ? "s" : ""}
                {" "}in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-3">
              Looks like you haven't added
              anything yet.
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    {/* PRODUCT */}
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.product.imageUrl ||
                          "https://via.placeholder.com/150"
                        }
                        alt={
                          item.product.name
                        }
                        className="w-24 h-24 rounded-2xl object-cover bg-gray-100"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">
                          {
                            item.product.name
                          }
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {
                            item.product
                              .description
                          }
                        </p>

                        <p className="font-bold text-xl mt-2">
                          Rs.{" "}
                          {
                            item.product
                              .price
                          }
                        </p>

                        {/* QUANTITY */}
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() =>
                              item.quantity >
                                1 &&
                              handleQuantity(
                                item.id,
                                item.quantity -
                                  1
                              )
                            }
                            className="w-9 h-9 border rounded-xl flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="font-semibold text-lg min-w-[30px] text-center">
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            onClick={() =>
                              handleQuantity(
                                item.id,
                                item.quantity +
                                  1
                              )
                            }
                            className="w-9 h-9 border rounded-xl flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() =>
                        handleRemove(
                          item.id
                        )
                      }
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 h-fit sticky top-8">
              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal
                  </span>
                  <span>
                    Rs.{" "}
                    {subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Shipping
                  </span>

                  <span className="text-green-600">
                    Free
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>

                  <span>
                    Rs.{" "}
                    {subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    "/checkout"
                  )
                }
                className="mt-6 w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}