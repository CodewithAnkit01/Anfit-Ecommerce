import prisma from "../utils/prisma.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: req.user.userId,
        productId,
      },
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: req.user.userId,
        productId,
      },
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        product: true,
      },
    });

    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.wishlist.delete({
      where: { id },
    });

    res.json({
      message: "Product removed from wishlist",
    });
} catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};