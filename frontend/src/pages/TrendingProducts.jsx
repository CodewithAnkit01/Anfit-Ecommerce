import { Flame, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { getTrendingProducts } from "../api/product.api";
import {addToWishlist} from "../api/wishlist.api"
import {addToCart} from "../api/cart.api"
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export default function TrendingProducts() {
const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const res = await getTrendingProducts();
      
      setProducts(res.data);
    } catch (error) {
      toast.error(
      error.response?.data?.message || "Something went wrong"
    );
    } finally {
      setLoading(false);
    }
  };

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
      error.response?.data?.message || "Something went wrong"
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
    <section className="max-w-7xl mx-auto px-6 py-20">

      <div className="flex justify-between items-center mb-10">

        <div>
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Flame size={18} />
            Trending Now
          </div>

          <h2 className="text-4xl font-bold">
            Popular Products
          </h2>
        </div>

        <Link to="/products" className="flex items-center gap-2">
          View All
          <ArrowRight size={18} />
        </Link>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.slice(0, 6).map((p) => (
          <div
            onClick={() => navigate(`/products/${p.id}`)}

  className="
    group
    bg-white
    border border-gray-100
    rounded-[28px]
    overflow-hidden
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300

    
  "
  key={p.id}
>
  {/* IMAGE */}
<div className="relative h-64 bg-gray-100">
              <img
                src={p.imageUrl || "https://placehold.co/400"}
                alt={p.name}
                className="w-full h-full object-cover"
              />

    {/* WISHLIST */}
   

    {/* TRENDING BADGE */}
    <span
      className="
        absolute
        left-4
        top-4
        bg-orange-500
        text-white
        text-xs
        px-3
        py-1
        rounded-full
      "
    >
      Trending
    </span>
  </div>

  {/* CONTENT */}
  <div className="p-5">

    <h3 className="font-semibold text-lg">
     {p.name}
    </h3>

    <p className="text-sm text-gray-500 mt-2">
      {p.description}
    </p>

    <div className="mt-4 flex items-center justify-between">
      <span className="text-xl font-bold">
        Rs {p.price.toLocaleString()}
      </span>

      <span
                  className={`text-sm ${
                    p.stock > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {p.stock > 0
                    ? "In Stock"
                    : "Out Of Stock"}
                </span>
    </div>

    {/* ACTIONS */}
    <div className="grid grid-cols-2 gap-3 mt-5">

      <button
       onClick={(e) => {
        e.stopPropagation();
        handleWishlist(p.id)}}
        className="
          py-3
          rounded-2xl
          border
          border-gray-200
          hover:bg-gray-50
          transition
        "
      >
        Wishlist
      </button>

      <button
       onClick={(e) =>{
        e.stopPropagation();

       handleAddToCart(p.id, p.stock)}}
        className="
          py-3
          rounded-2xl
          bg-black
          text-white
          hover:opacity-90
          transition
        "
      >
        Add Cart
      </button>

    </div>

  </div>
</div>
        ))}

      </div>
    </section>
  );
}