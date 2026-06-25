import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-2xl font-bold">
              ANFIT
            </h2>

            <p className="text-gray-500 mt-4 text-sm">
              Premium ecommerce experience with
              modern design and secure checkout.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Shop
            </h3>

            <div className="space-y-3 text-gray-500 text-sm">
              <Link to="/products" className="block">
                Products
              </Link>

              <Link to="/cart" className="block">
                Cart
              </Link>

              <Link to="/wishlist" className="block">
                Wishlist
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Account
            </h3>

            <div className="space-y-3 text-gray-500 text-sm">
              <Link to="/login" className="block">
                Login
              </Link>

              <Link to="/register" className="block">
                Register
              </Link>

              <Link to="/profile" className="block">
                Profile
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Contact
            </h3>

            <p className="text-gray-500 text-sm">
              support@anfit.com
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Pokhara, Nepal
            </p>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-sm text-gray-500">
          © 2026 ANFIT. All rights reserved.
        </div>

      </div>
    </footer>
  );
}