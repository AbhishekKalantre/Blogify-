import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUserQuery = async (user) => {
  try {
    // Check if email or username already exists
    const checkQuery = `SELECT * FROM users WHERE email = ? OR username = ?`;
    const [existingUsers] = await pool.query(checkQuery, [
      user.email,
      user.username,
    ]);

    if (existingUsers.length > 0) {
      // Check if email exists
      if (existingUsers.some((u) => u.email === user.email)) {
        return { success: false, message: "Email already in use" };
      }
      // Check if username exists
      if (existingUsers.some((u) => u.username === user.username)) {
        return { success: false, message: "Username already taken" };
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Insert the new user
    const query = `INSERT INTO users (firstName, lastName, username, email, password) 
                  VALUES (?, ?, ?, ?, ?);`;
    const values = [
      user.firstName,
      user.lastName,
      user.username,
      user.email,
      hashedPassword,
    ];

    await pool.query(query, values);
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Error registering user: ", error);
    return { success: false, message: "Failed to register user" };
  }
};

export const loginUserQuery = async (email, password) => {
  try {
    // Find user by email
    const query = `SELECT * FROM users WHERE email = ?`;
    const [users] = await pool.query(query, [email]);

    // Check if user exists
    if (users.length === 0) {
      return { success: false, message: "Invalid email or password" };
    }

    const user = users[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-default-secret-key",
      { expiresIn: "1d" }
    );

    return {
      success: true,
      message: "Login successful",
      user: userData,
      token: token,
    };
  } catch (error) {
    console.error("Login error: ", error);
    return { success: false, message: "Server error during login" };
  }
};
