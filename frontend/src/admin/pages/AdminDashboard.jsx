import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Activity,
} from "lucide-react";

import { getStats } from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon,
    title,
    value,
    color,
  }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between hover:shadow-lg transition">
      <div>
        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`p-4 rounded-2xl ${color}`}
      >
        {icon}
      </div>
    </div>
  );

  const getStatusStyle = (status) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">
            Dashboard Overview
          </h2>

          <p className="text-gray-500 mt-1">
            Monitor your ecommerce business
          </p>
        </div>

        <span className="text-sm text-gray-500">
          Admin Control Panel
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={
            <Users className="text-blue-600" />
          }
          title="Total Users"
          value={stats.users}
          color="bg-blue-100"
        />

        <StatCard
          icon={
            <ShoppingBag className="text-green-600" />
          }
          title="Products"
          value={stats.products}
          color="bg-green-100"
        />

        <StatCard
          icon={
            <Package className="text-purple-600" />
          }
          title="Orders"
          value={stats.orders}
          color="bg-purple-100"
        />

        <StatCard
          icon={
            <DollarSign className="text-yellow-600" />
          }
          title="Revenue"
          value={`Rs ${stats.revenue}`}
          color="bg-yellow-100"
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity />
            Recent Orders
          </h3>

          <Link
            to="/admin/orders"
            className="text-sm text-gray-500 hover:text-black"
          >
            View All
          </Link>
        </div>

        {stats.recentOrders?.length > 0 ? (
          <div className="space-y-4">
            {stats.recentOrders.map(
              (order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <h4 className="font-semibold">
                      Order #{order.id}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {order.user?.name ||
                        "Unknown User"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <div className="font-bold">
                    Rs {order.totalPrice}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No recent orders found
          </div>
        )}
      </div>
    </div>
  );
}