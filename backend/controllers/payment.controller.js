import prisma from "../utils/prisma.js";


export const initiateEsewaPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // normally here we verify order
    const paymentData = {
      amount,
      orderId,
      successUrl: `http://localhost:5000/api/payment/success/${orderId}`,
      failureUrl: `http://localhost:5000/api/payment/failure/${orderId}`,
    };

    // eSewa redirect URL (demo)
    const esewaUrl = `https://esewa.com.np/epay/main?q=payment&amt=${amount}&pid=${orderId}`;

    res.json({
      message: "Redirect to eSewa",
      url: esewaUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const paymentSuccess = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "PAID",
      },
    });

    return res.json({
      message: "Payment successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const paymentFailure = async (req, res) => {
  try {
    const { orderId } = req.query;

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: "FAILED" },
    });

    res.json({
      message: "Payment failed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};