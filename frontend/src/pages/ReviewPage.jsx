import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createReview } from "../api/review.api";
import { getProductById } from "../api/product.api";

import { Star } from "lucide-react";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res.data);
    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  const handleReview = async () => {
    if (!comment) {
      toast.warning("Please write a review");
      return;
    }

    try {
      setLoading(true);

      await createReview({
        productId: Number(id),
        rating,
        comment,
      });

      toast.success("Review submitted successfully");

      navigate(`/products/${id}`); // 👈 back to product page
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-8 space-y-6">

        {/* PRODUCT INFO */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={product.imageUrl}
            className="w-16 h-16 object-cover rounded-xl border"
          />

          <div>
            <h2 className="font-semibold text-lg">
              {product.name}
            </h2>

            <p className="text-gray-500 text-sm">
              Share your experience
            </p>
          </div>
        </div>

        {/* STAR RATING */}
        <div>
          <p className="mb-2 font-medium">
            Rating
          </p>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer transition ${
                  (hover || rating) >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                fill={
                  (hover || rating) >= star
                    ? "currentColor"
                    : "none"
                }
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </div>

        {/* COMMENT */}
        <div>
          <p className="mb-2 font-medium">
            Your Review
          </p>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your experience..."
            className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleReview}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

      </div>
    </div>
  );
}