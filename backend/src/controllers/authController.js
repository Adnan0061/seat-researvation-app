const User = require("../models/User");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/errorHandler");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email: email.trim() });
    if (userExists) {
      res.status(400);
      console.log("user exist test");
      return next(new Error("User already exists"));
    }

    const user = await User.create({
      name,
      email: email.trim(),
      password,
    });

    console.log("user exist test before res");
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }
  } catch (error) {
    res.status(401);
    throw error;
  }
};
const validateToken = async (req, res) => {
  try {
    // User is already populated by protect middleware
    const user = await User.findById(req.user.id).select("-password").lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = { register, login, validateToken };
