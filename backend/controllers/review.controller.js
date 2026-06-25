import prisma from "../utils/prisma.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    
    const existingReview = await prisma.review.findFirst({
  where: {
    userId: req.user.userId,
    productId,
  },
});

if (existingReview) {
  return res.status(400).json({
    message: "You already reviewed this product",
  });
}

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId: req.user.userId,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

