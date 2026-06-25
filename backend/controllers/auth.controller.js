import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  prisma  from "../utils/prisma.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

      
    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password)
    

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    

    res.json({ message: "Login successful", token ,user:{
        id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


