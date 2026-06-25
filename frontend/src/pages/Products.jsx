import {
  Heart,
  ShoppingCart,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api";
import { addToWishlist } from "../api/wishlist.api";
import { addToCart } from "../api/cart.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const [search, setSearch] = useState("");
const [loadingCartId, setLoadingCartId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products || []);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
  product.name
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const handleWishlist = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    try {
      await addToWishlist({
        productId: id,
      });

      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

const handleAddToCart = async (id, stock) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.warning("Please login first");
    navigate("/login");
    return;
  }

  // ✅ FIX HERE
  if (stock <= 0) {
    toast.error("Out of stock product");
    return;
  }

  try {
    setLoadingCartId(id);

    await addToCart({
      productId: id,
      quantity: 1,
    });

    toast.success("Added to cart");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to add to cart"
    );
  } finally {
    setLoadingCartId(null);
  }
};

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HERO */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Discover Products
          </h1>

          <p className="text-gray-500 mt-2">
            Modern shopping experience with clean UI
          </p>

          {/* SEARCH */}
          <div className="mt-6 flex gap-3 max-w-2xl">
            <div
              className="flex items-center flex-1 gap-2 px-4 py-3 rounded-2xl
              bg-white border border-gray-100 shadow-sm"
            >
              <Search className="w-4 h-4 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full outline-none text-sm"
              />
            </div>

            <button
              className="px-4 py-3 rounded-2xl border border-gray-100
              bg-white shadow-sm hover:shadow-md transition"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-28">
            <div
              className="w-24 h-24 rounded-3xl bg-white border border-gray-100
              shadow-sm flex items-center justify-center text-3xl"
            >
              🛍️
            </div>

            <h2 className="text-2xl font-semibold mt-6 text-gray-900">
              No products found
            </h2>

            <p className="text-gray-500 mt-2 max-w-md">
              We couldn't find any products.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="group bg-white rounded-3xl border border-gray-100
                shadow-sm hover:shadow-xl hover:-translate-y-1
                transition-all duration-300 overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                          src={
                            p.imageUrl ||
                            "https://via.placeholder.com/500x500?text=Product"
                          }
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <button
                    onClick={(e) => {
                            e.stopPropagation();
                            handleWishlist(p.id);
                          }}
                    className="absolute top-3 right-3 bg-white border border-gray-100
                    rounded-full p-2 shadow-sm hover:scale-110 transition"
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">
                    {p.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex justify-between items-center mt-5">
                    <span className="font-bold text-lg text-gray-900">
                      Rs. {p.price?.toLocaleString()}
                    </span>

                    <span
                      className={`text-xs font-medium ${
                        p.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {p.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>

                 <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p.id, p.stock);
                      }}
                      disabled={loadingCartId === p.id || p.stock === 0}
                      className="mt-5 w-full flex items-center justify-center gap-2
                      bg-black text-white py-3 rounded-2xl
                      hover:bg-gray-900 transition disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4" />

                      {loadingCartId === p.id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}