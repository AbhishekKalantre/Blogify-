import UserModel from "../models/userModel.js";
import { createUserQuery, loginUserQuery } from "../services/userService.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Create user model instance
    const user = new UserModel({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Create user in database
    const response = await createUserQuery(user);
    return res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("Registration Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Login user
    const response = await loginUserQuery(email, password);
    return res.status(response.success ? 200 : 401).json(response);
  } catch (error) {
    console.error("Login Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
