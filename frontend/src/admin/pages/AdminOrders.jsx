import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PackageCheck,
  CircleDollarSign,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../api/order.api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load orders ❌");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      toast.success(
        "Order status updated ✨"
      );

      fetchOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update order ❌"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "SHIPPED":
        return "bg-blue-100 text-blue-700";

      case "PAID":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
    <PackageCheck />
    Admin Orders
  </h1>

  <span className="text-sm text-gray-500">
    Manage all customer orders
  </span>
</div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
  <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 md:px-4">
                  Order ID
                </th>

                <th className="px-3 py-3 md:px-4">
                  Customer
                </th>

                <th className="px-3 py-3 md:px-4">
                  Phone
                </th>

                <th className="px-3 py-3 md:px-4">
                  City
                </th>

                <th className="px-3 py-3 md:px-4">
                  Items
                </th>

                <th className="px-3 py-3 md:px-4">
                  Total
                </th>

                <th className="px-3 py-3 md:px-4">
                  Status
                </th>

                <th className="px-3 py-3 md:px-4">
                  Date
                </th>

                <th className="px-3 py-3 md:px-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      {order.user?.name ||
                        "Unknown"}
                    </td>

                    <td className="p-4">
                      {order.phone || "-"}
                    </td>

                    <td className="p-4">
                      {order.city || "-"}
                    </td>

                    {/* ITEMS */}
                   <td className="px-3 py-3 md:px-4 min-w-[250px]">
  <div className="flex flex-wrap gap-1">
                        {order.orderItems?.length >
                        0 ? (
                          order.orderItems.map(
                            (item) => (
                              <span
                                key={item.id}
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                              >
                                {
                                  item.product
                                    ?.name
                                }{" "}
                                ×{" "}
                                {
                                  item.quantity
                                }
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-gray-400">
                            No Items
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <CircleDollarSign
                          size={16}
                        />
                        Rs{" "}
                        {order.totalPrice}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`border rounded-lg px-2 py-2 text-xs md:text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="PENDING">
                          PENDING
                        </option>

                        <option value="SHIPPED">
                          SHIPPED
                        </option>

                        <option value="PAID">
                          PAID
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-10 text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


                <div className="md:hidden space-y-4 mt-4">
  {orders.length > 0 ? (
    orders.map((order) => (
      <div
        key={order.id}
        className="bg-white rounded-xl shadow p-4"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">
            Order #{order.id}
          </h3>

          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Customer:</strong>{" "}
            {order.user?.name || "Unknown"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.phone || "-"}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {order.city || "-"}
          </p>

          <p>
            <strong>Total:</strong> Rs{" "}
            {order.totalPrice}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-3">
          <p className="font-medium mb-2">
            Ordered Items
          </p>

          <div className="flex flex-wrap gap-2">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item) => (
                <span
                  key={item.id}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {item.product?.name} ×{" "}
                  {item.quantity}
                </span>
              ))
            ) : (
              <span className="text-gray-400">
                No Items
              </span>
            )}
          </div>
        </div>

        <select
          value={order.status}
          onChange={(e) =>
            updateStatus(
              order.id,
              e.target.value
            )
          }
          className="w-full mt-4 border rounded-lg p-2"
        >
          <option value="PENDING">
            PENDING
          </option>

          <option value="SHIPPED">
            SHIPPED
          </option>

          <option value="PAID">
            PAID
          </option>
        </select>
      </div>
    ))
  ) : (
    <div className="text-center py-10 text-gray-500">
      No orders found
    </div>
  )}
</div>

    </div>
  );
}