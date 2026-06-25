import { Link } from "react-router-dom";
import TrendingProducts from "./TrendingProducts";
import heroImg from "../assets/hero.png";
import hero1Img from "../assets/hero1.png";

import {
  Truck,
  Shield,
  Heart,
  Star,
} from "lucide-react";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="bg-[#f5f6fa] text-gray-900">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center">
        {/* TEXT */}
        <div>
          <p className="text-sm text-gray-500 tracking-wide">
            ANFIT • Modern Ecommerce
          </p>

          <h1 className="text-5xl font-semibold leading-tight mt-4">
            Shop with a <br />
            cleaner experience
          </h1>

          <p className="text-gray-600 mt-5 max-w-md leading-relaxed">
            Discover products, manage your cart, wishlist, and orders in a
            smooth modern interface designed for real users.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/products"
              className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              Shop Now
            </Link>

            {token ? (
              <Link
                to="/profile"
                className="bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                My Profile
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        {/* IMAGES */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="overflow-hidden rounded-xl mb-4 sm:mb-5">
            <img
              src={hero1Img}
              alt="Hero"
              className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-3 sm:p-4">
            <img
              src={heroImg}
              alt="Featured Banner"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {[
          {
            icon: <Truck />,
            title: "Fast Delivery",
            desc: "Quick and reliable shipping",
          },
          {
            icon: <Shield />,
            title: "Secure Checkout",
            desc: "Safe payments system",
          },
          {
            icon: <Heart />,
            title: "Wishlist",
            desc: "Save your favorite items",
          },
          {
            icon: <Star />,
            title: "Top Quality",
            desc: "Trusted by customers",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="text-gray-700">{item.icon}</div>

            <h3 className="font-medium mt-4">{item.title}</h3>

            <p className="text-gray-500 text-sm mt-2">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <TrendingProducts />
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">
            Start your shopping journey
          </h2>

          <p className="text-gray-500 mt-3">
            Clean, modern, and distraction-free ecommerce experience
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
}