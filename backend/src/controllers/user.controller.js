import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function generateToken(userId) {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Required all the fields" });
    }

    const findUser = await User.findOne({ email: email });

    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "User with the email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(createUser._id);

    const expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: expiryDate,
    };

    return res
      .status(200)
      .cookie("userToken", token, options)
      .json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Required all the fields" });
    }

    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const comparePassword = bcrypt.compare(findUser.password, password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(findUser._id);

    const expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: expiryDate,
    };

    return res
      .status(200)
      .cookie("userToken", token, options)
      .json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: expiryDate,
    };

    return res
      .status(200)
      .clearCookie("userToken", options)
      .json({ success: true, message: "User logged out" });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    return res
      .json(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
