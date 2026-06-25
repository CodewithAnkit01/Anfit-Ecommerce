import {
  User,
  Mail,
  ShoppingBag,
  Package,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMyOrders } from "../api/order.api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-gray-900">
            My Account
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your profile, orders and wishlist
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR */}
          <div>
            <div className="bg-white border border-gray-100 rounded-[32px] p-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  {user?.name}
                </h2>

                <p className="text-gray-500 text-sm">
                  Customer Account
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} />
                  {user?.email}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Package size={18} />
                  Member since 2026
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white border border-gray-100 rounded-3xl p-6">
                <ShoppingBag className="w-6 h-6 mb-4" />

                <h3 className="text-3xl font-bold">
                  {orders.length}
                </h3>

                <p className="text-gray-500 text-sm">
                  Orders
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-6">
                <Settings className="w-6 h-6 mb-4" />

                <h3 className="text-xl font-bold">
                  Active
                </h3>

                <p className="text-gray-500 text-sm">
                  Account Status
                </p>
              </div>
            </div>

            {/* ORDERS */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  My Orders
                </h2>

                <span className="text-sm text-gray-500">
                  {orders.length} Orders
                </span>
              </div>

              <div className="mt-6">
                {loading ? (
                  <div className="text-center py-10">
                    Loading...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No Orders Found
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-100 rounded-3xl p-6"
                      >
                        {/* ORDER HEADER */}
                        <div className="flex justify-between items-center mb-5">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Order #{order.id}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {order.orderItems?.length || 0} Products
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg">
                              Rs {order.totalPrice}
                            </p>

                            <span
                              className={`text-sm font-medium ${
                                order.status === "PENDING"
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* ORDER ITEMS */}
                        <div className="space-y-3">
                          {order.orderItems?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between border-t pt-3"
                            >
                              {/* PRODUCT INFO */}
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    item.product?.imageUrl ||
                                    "https://placehold.co/100x100"
                                  }
                                  alt={item.product?.name}
                                  className="w-16 h-16 rounded-xl object-cover border"
                                />

                                <div>
                                  <h4 className="font-medium">
                                    {item.product?.name}
                                  </h4>

                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>

                              {/* PRICE + REVIEW BUTTON */}
                              <div className="flex items-center gap-4">
                                <p className="font-semibold">
                                  Rs {item.product?.price}
                                </p>

                                <Link
                                  to={`/products/${item.productId}/review`}
                                  className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-800 transition"
                                >
                                  Add Review
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* TOTAL */}
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="font-medium">
                            Total Amount
                          </span>

                          <span className="font-bold text-lg">
                            Rs {order.totalPrice}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Saved Address
              </h2>

              <div className="border border-gray-100 rounded-2xl p-5">
                <p className="font-medium">Default Address</p>

                <p className="text-gray-500 mt-2">
                  Orders will use your latest checkout address.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}