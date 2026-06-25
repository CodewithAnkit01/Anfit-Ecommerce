import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getProductById } from "../api/product.api";
import { addToWishlist } from "../api/wishlist.api";
import { addToCart } from "../api/cart.api";
import Loader from "../components/Loader";
import { getProductReviews } from "../api/review.api";

import {
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

    const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        ) / reviews.length
      ).toFixed(1)
    : 0;

  useEffect(() => {
  fetchProduct();
  fetchReviews();
}, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    try {
      await addToWishlist({
        productId: product.id,
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

  const fetchReviews = async () => {
  try {
    const res = await getProductReviews(id);

    setReviews(res.data || []);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to load reviews"
    );
  }
};

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">
          Product Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <div>
            {/* MAIN IMAGE */}
            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden h-[500px]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-4 mt-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-2xl overflow-hidden border border-gray-100 bg-white"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* STOCK */}
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                product.stock > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {product.stock > 0
                ? "In Stock"
                : "Out Of Stock"}
            </div>

            <h1 className="text-4xl font-bold mt-4 text-gray-900">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex items-center gap-3 mt-4">
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={18}
        fill={
          star <= Math.round(averageRating)
            ? "currentColor"
            : "none"
        }
        className="text-yellow-500"
      />
    ))}
  </div>

  <span className="font-semibold">
    {averageRating}
  </span>

  <span className="text-gray-500 text-sm">
    ({reviews.length} Reviews)
  </span>
</div>

            {/* PRICE */}
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">
                Rs. {product.price?.toLocaleString()}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* FEATURES */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-500" />
                <span>Free delivery available</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <span>Official warranty included</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-10">

                <div className="flex items-center gap-4 mt-6">
  {/* MINUS */}
  <button
    onClick={() =>
      setQuantity((prev) =>
        Math.max(1, prev - 1)
      )
    }
    className="
      w-10 h-10
      rounded-xl
      border
      hover:bg-gray-100
      transition
    "
  >
    -
  </button>

  <span className="font-semibold text-lg min-w-[30px] text-center">
    {quantity}
  </span>

  {/* PLUS */}
  <button
    onClick={() =>
      setQuantity((prev) =>
        prev < product.stock
          ? prev + 1
          : prev
      )
    }
    className="
      w-10 h-10
      rounded-xl
      border
      hover:bg-gray-100
      transition
    "
  >
    +
  </button>

  <span className="text-sm text-gray-500 ml-2">
    Stock: {product.stock}
  </span>
</div>
              <button
                onClick={(e) => {
    e.stopPropagation();
    handleAddToCart(product.id, product.stock);
  }}
  disabled={loadingCart || product.stock === 0}
                className="
                flex-1
                bg-black
                text-white
                py-4
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                hover:opacity-90
                transition
                disabled:opacity-50
              "
              >
                <ShoppingCart size={18} />

                {loadingCart
                  ? "Adding..."
                  : "Add To Cart"}
              </button>

              <button
                onClick={handleWishlist}
                className="
                w-14
                rounded-2xl
                border
                border-gray-200
                bg-white
                flex
                items-center
                justify-center
                hover:bg-gray-50
              "
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white border border-gray-100 rounded-[32px] p-8">
          <h2 className="text-2xl font-semibold">
            Product Details
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
  <div className="bg-white border border-gray-100 rounded-[32px] p-8">
    <h2 className="text-2xl font-semibold mb-6">
      Customer Reviews
    </h2>

    {reviews.length === 0 ? (
      <p className="text-gray-500">
        No reviews yet.
      </p>
    ) : (
      reviews.map((review) => (
       <div
  key={review.id}
  className="bg-slate-50 rounded-2xl p-5 mb-4"
>
  <div className="flex justify-between items-center">
    <h4 className="font-semibold">
      {review.user?.name}
    </h4>

    <div className="flex">
      {[...Array(review.rating)].map((_, i) => (
        <Star
          key={i}
          size={16}
          fill="currentColor"
          className="text-yellow-500"
        />
      ))}
    </div>
  </div>

  <p className="mt-3 text-gray-600">
    {review.comment}
  </p>
</div>
      ))
    )}
  </div>
</div>
    </div>
  );
}
