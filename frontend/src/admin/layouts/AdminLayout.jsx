import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <ShoppingBag size={18} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <Package size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
      >
        <Menu />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
        transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        }
        md:translate-x-0`}
      >
        <div className="p-6 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold">
            Admin Panel
          </h1>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                location.pathname === menu.path
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {menu.icon}
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4">
          <Link to='/'
            
            className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600"
          >
            
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}