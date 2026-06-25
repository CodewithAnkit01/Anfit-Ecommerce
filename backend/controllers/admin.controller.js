import prisma from "../utils/prisma.js";

export const getStats = async (req, res) => {
  try {
    const users = await prisma.user.count();

    const products = await prisma.product.count();

    const orders = await prisma.order.count();

    const revenueResult = await prisma.order.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        totalPrice: true,
      },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      users,
      products,
      orders,
      revenue: revenueResult._sum.totalPrice || 0,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};