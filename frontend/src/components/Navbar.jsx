import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronDown, UserCircle } from "lucide-react";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getUser());

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  useEffect(() => {
  const handleStorageChange = () => {
    setUser(JSON.parse(localStorage.getItem("user")));
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);
useEffect(() => {
  const updateUser = () => {
    setUser(JSON.parse(localStorage.getItem("user")));
  };

  window.addEventListener("authChange", updateUser);

  return () => {
    window.removeEventListener("authChange", updateUser);
  };
}, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    window.dispatchEvent(new Event("storage"));
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-700 hover:text-black transition font-medium relative
      after:content-[''] after:absolute after:left-0 after:-bottom-1
      after:w-0 after:h-[2px] after:bg-black after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Sparkles />
          ANFIT
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">

          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>

          {user && (
            <>
              <NavLink to="/cart">
                <span className="flex items-center gap-1">
                  <ShoppingCart size={18} /> Cart
                </span>
              </NavLink>

              <NavLink to="/wishlist">
                <span className="flex items-center gap-1">
                  <Heart size={18} /> Wishlist
                </span>
              </NavLink>
            </>
          )}

          {/* ADMIN BUTTON (IMPROVED) */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="
                flex items-center gap-2
                px-3 py-1
                rounded-full
                bg-gradient-to-r from-red-500 to-red-600
                text-white text-sm
                shadow-md
              "
            >
              <Shield size={14} />
              Admin Panel
            </Link>
          )}
        </div>

        {/* AUTH */}
        <div className="hidden md:flex items-center gap-3">

          {!user ? (
  <Link
    to="/login"
    className="bg-black text-white px-5 py-2 rounded-xl hover:opacity-90"
  >
    Login / Register
  </Link>
) : (
  <div className="relative">
    <button
      onClick={() =>
        setProfileOpen(!profileOpen)
      }
      className="
      flex items-center gap-3
      px-3 py-2
      rounded-xl
      border
      hover:bg-gray-50
      transition
    "
    >
      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
        {user?.name?.charAt(0)}
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold">
          {user?.name}
        </p>

        <p className="text-xs text-gray-500">
          {user?.role}
        </p>
      </div>

      <ChevronDown size={16} />
    </button>

    {profileOpen && (
      <div
        className="
        absolute
        right-0
        top-14
        w-56
        bg-white
        rounded-2xl
        shadow-xl
        border
        overflow-hidden
      "
      >
        <Link
          to="/profile"
          onClick={() =>
            setProfileOpen(false)
          }
          className="
          flex items-center gap-3
          px-4 py-3
          hover:bg-gray-50
        "
        >
          <UserCircle size={18} />
          My Profile
        </Link>



        <button
          onClick={() => {
            logout();
            setProfileOpen(false);
          }}
          className="
          w-full
          text-left
          px-4 py-3
          text-red-500
          hover:bg-red-50
        "
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 border rounded-lg"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-5 flex flex-col gap-4 bg-white border-t">

          <Link onClick={() => setOpen(false)} to="/">Home</Link>
          <Link onClick={() => setOpen(false)} to="/products">Products</Link>

          {user && (
            <>
              <Link onClick={() => setOpen(false)} to="/cart">Cart</Link>
              <Link onClick={() => setOpen(false)} to="/wishlist">Wishlist</Link>
            </>
          )}

          {isAdmin && (
            <Link
              onClick={() => setOpen(false)}
              to="/admin/dashboard"
              className="text-red-600 font-semibold"
            >
              Admin Panel
            </Link>
          )}

          {!user ? (
            <>
              <Link className="bg-black text-white px-4 py-1 rounded-lg hover:opacity-90" to="/login">
                Login / Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="text-red-500 text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}