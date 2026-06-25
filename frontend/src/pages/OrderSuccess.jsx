import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
        <CheckCircle
          size={70}
          className="mx-auto text-green-500"
        />

        <h1 className="text-3xl font-bold mt-4">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-500 mt-3">
          Thank you for shopping with us.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Back To Home
          </Link>

          <Link
            to="/profile"
            className="border px-6 py-3 rounded-xl"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}