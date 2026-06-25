import prisma from "../utils/prisma.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { phone, address, city } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Stock validation
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.product.name} is out of stock`,
        });
      }
    }

    const totalPrice = cartItems.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        phone,
        address,
        city,
      },
    });

    // Create order items + decrease stock
    for (const item of cartItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      const updatedProduct =
        await prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

      console.log(
        "Product ID:",
        item.productId
      );
      console.log(
        "Quantity:",
        item.quantity
      );
      console.log(
        "Updated Stock:",
        updatedProduct.stock
      );
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);

    const { status } = req.body;

    const order =
      await prisma.order.update({
        where: { id },
        data: { status },
      });

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};