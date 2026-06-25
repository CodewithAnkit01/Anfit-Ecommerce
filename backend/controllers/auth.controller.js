import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

// EMAIL REGEX
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// PASSWORD:
// Min 8 chars
// 1 uppercase
// 1 lowercase
// 1 number
// 1 special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// REGISTER
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Trim
    name = name?.trim();
    email = email?.trim().toLowerCase();

    // Empty validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Name validation
    if (name.length < 3) {
      return res.status(400).json({
        message: "Name must be at least 3 characters",
      });
    }

    // Email validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain 8+ chars, uppercase, lowercase, number and special character",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    // Empty validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Email validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security: same message for email/password
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};