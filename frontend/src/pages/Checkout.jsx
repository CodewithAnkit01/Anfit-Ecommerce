import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { toast } from "react-toastify";
import Loader from "../components/Loader";

import { getCart } from "../api/cart.api";
import { checkout } from "../api/order.api";
import { initiateEsewaPayment } from "../api/payment.api";

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
  if (!phone || !city || !address) {
    toast.warning("Please fill all shipping details");
    return;
  }

  try {
    setPlacingOrder(true);

    const orderRes = await checkout({
      phone,
      city,
      address,
    });

    const order = orderRes.data.order;

    if (paymentMethod === "ESEWA") {
      const paymentRes =
        await initiateEsewaPayment({
          orderId: order.id,
          amount: order.totalPrice,
        });

      window.location.href =
        paymentRes.data.url;

      return;
    }

    toast.success("Order placed successfully 🎉");

    // HOME PAGE MA HOINA
    navigate("/order-success");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to place order"
    );
  } finally {
    setPlacingOrder(false);
  }
};
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="uppercase tracking-[4px] text-xs font-semibold text-gray-500">
            Secure Checkout
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Complete Your Order
          </h1>

          <p className="text-gray-500 mt-3">
            Fast delivery • Secure payment •
            Premium shopping experience
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* SHIPPING */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-black text-white p-3 rounded-2xl">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Shipping Address
                  </h2>

                  <p className="text-gray-500">
                    Enter your delivery details
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Phone Number"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black transition"
                />

                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="City"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black transition"
                />

                <textarea
                  rows="5"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="Full Address"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-black text-white p-3 rounded-2xl">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Payment Method
                  </h2>

                  <p className="text-gray-500">
                    Select your preferred
                    payment option
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* COD */}
                <label
                  className={`cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 ${
                    paymentMethod === "COD"
                      ? "bg-black text-white border-black scale-[1.02]"
                      : "bg-white border-slate-200 hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={
                      paymentMethod ===
                      "COD"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "COD"
                      )
                    }
                  />

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        Cash On Delivery
                      </h3>

                      <p className="mt-2 text-sm opacity-80">
                        Pay after receiving
                        your order
                      </p>
                    </div>

                    {paymentMethod ===
                      "COD" && (
                      <CheckCircle2 />
                    )}
                  </div>
                </label>

                {/* ESEWA */}
                <label
                  className={`cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 ${
                    paymentMethod ===
                    "ESEWA"
                      ? "bg-green-600 text-white border-green-600 scale-[1.02]"
                      : "bg-white border-slate-200 hover:border-green-500"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={
                      paymentMethod ===
                      "ESEWA"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "ESEWA"
                      )
                    }
                  />

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        eSewa Payment
                      </h3>

                      <p className="mt-2 text-sm opacity-80">
                        Instant secure online
                        payment
                      </p>
                    </div>

                    {paymentMethod ===
                      "ESEWA" && (
                      <CheckCircle2 />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="sticky top-28 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="mt-8 space-y-5 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">
                    Cart is empty
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-slate-100 pb-4"
                    >
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden">
                          <img
                            src={
                              item.product
                                ?.imageUrl ||
                              "https://placehold.co/100x100"
                            }
                            alt={
                              item.product
                                ?.name
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold">
                            {
                              item.product
                                ?.name
                            }
                          </h4>

                          <p className="text-sm text-gray-500">
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>
                      </div>

                      <span className="font-bold">
                        Rs.
                        {(
                          item.product
                            ?.price *
                          item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* TOTALS */}
              <div className="mt-8 bg-slate-50 rounded-3xl p-5">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      Rs.
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Shipping
                    </span>

                    <span className="text-green-600 font-semibold">
                      Free
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-xl font-bold">
                    <span>Total</span>

                    <span>
                      Rs.
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* BADGES */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <Truck size={18} />

                  <p className="text-sm mt-2 font-medium">
                    Free Delivery
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <ShieldCheck size={18} />

                  <p className="text-sm mt-2 font-medium">
                    Secure Payment
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={
                  placingOrder ||
                  cartItems.length === 0
                }
                className="
                w-full
                mt-8
                py-5
                rounded-2xl
                bg-black
                text-white
                font-semibold
                text-lg
                transition-all
                hover:scale-[1.02]
                hover:bg-slate-800
                disabled:opacity-50
                disabled:hover:scale-100
              "
              >
                {placingOrder
                  ? "Processing..."
                  : paymentMethod ===
                    "ESEWA"
                  ? "Pay with eSewa"
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}