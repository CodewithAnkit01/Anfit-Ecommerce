import prisma from "../utils/prisma.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        message: "Name, description and price are required",
      });
    }

    const imageUrl = req.file
  ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  : null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock) || 0,
        imageUrl,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingProduct =
      await prisma.product.findUnique({
        where: { id },
      });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const data = {
      ...req.body,
    };

    if (req.body.price) {
      data.price = Number(req.body.price);
    }

    if (req.body.stock) {
      data.stock = Number(req.body.stock);
    }

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.cartItem.deleteMany({
      where: { productId: id },
    });

    await prisma.review.deleteMany({
      where: { productId: id },
    });

    await prisma.wishlist.deleteMany({
      where: { productId: id },
    });

    await prisma.orderItem.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// TRENDING PRODUCTS
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        orderItems: true,
      },
    });

    const trending = products
      .map((product) => ({
        ...product,
        totalSold: product.orderItems.length,
      }))
      .sort((a, b) => b.totalSold - a.totalSold);

    res.status(200).json(trending);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};