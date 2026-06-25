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

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await updateOrderStatus(
        id,
        status
      );

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PackageCheck />
          Admin Orders
        </h1>

        <span className="text-sm text-gray-500">
          Manage all customer orders
        </span>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Order ID
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                City
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-right">
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

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <CircleDollarSign
                        size={16}
                      />
                      Rs {order.totalPrice}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
                  colSpan="8"
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
  );
}