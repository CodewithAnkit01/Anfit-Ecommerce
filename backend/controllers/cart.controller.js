import prisma from "../utils/prisma.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: Number(userId),
        productId: Number(productId),
        quantity: Number(quantity),
      },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        product: true,
      },
    });

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cartItem.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE QUANTITY
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const item = await prisma.cartItem.update({
      where: {
        id: Number(id),
      },
      data: {
        quantity: Number(quantity),
      },
      include: {
        product: true,
      },
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};