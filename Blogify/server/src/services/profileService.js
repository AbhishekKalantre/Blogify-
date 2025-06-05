import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProfileQuery = async (id) => {
  try {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Profile Error: ", error);
    return { success: false, message: "Failed to fetch profile" };
  }
};

export const updateProfileQuery = async (id, userData) => {
  try {
    // Validate user exists
    const checkQuery = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.query(checkQuery, [id]);

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    // Create SET clause for SQL query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    if (userData.firstName !== undefined) {
      updateFields.push("firstName = ?");
      updateValues.push(userData.firstName);
    }

    if (userData.lastName !== undefined) {
      updateFields.push("lastName = ?");
      updateValues.push(userData.lastName);
    }

    if (userData.email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(userData.email);
    }

    if (userData.phone !== undefined) {
      updateFields.push("phone = ?");
      updateValues.push(userData.phone);
    }

    if (userData.address !== undefined) {
      updateFields.push("address = ?");
      updateValues.push(userData.address);
    }

    if (userData.profile_picture !== undefined) {
      updateFields.push("profile_picture = ?");
      updateValues.push(userData.profile_picture);
    }

    // If no fields to update, return success
    if (updateFields.length === 0) {
      return { success: true, message: "No fields to update", data: rows[0] };
    }

    // Add the updated_at timestamp
    updateFields.push("updated_at = NOW()");

    // Create and execute the update query
    const updateQuery = `UPDATE users SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;
    await pool.query(updateQuery, [...updateValues, id]);

    // Get the updated user data
    const [updatedRows] = await pool.query(checkQuery, [id]);

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedRows[0],
    };
  } catch (error) {
    console.error("Profile Update Error: ", error);
    return { success: false, message: "Failed to update profile" };
  }
};

export const updateProfilePictureQuery = async (id, filename) => {
  try {
    // Validate user exists and get current profile picture if any
    const checkQuery = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.query(checkQuery, [id]);

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const currentUser = rows[0];
    const oldProfilePicture = currentUser.profile_picture;

    // Create the file path based on the uploaded filename
    const profilePicturePath = `/uploads/profiles/${filename}`;

    // Update the user's profile picture in the database
    const updateQuery = `UPDATE users SET profile_picture = ?, updated_at = NOW() WHERE id = ?`;
    await pool.query(updateQuery, [profilePicturePath, id]);

    // If there was an old profile picture, delete it from the filesystem
    if (oldProfilePicture) {
      try {
        const oldFilename = oldProfilePicture.split("/").pop();
        const oldFilePath = path.join(
          __dirname,
          "../../uploads/profiles",
          oldFilename
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old profile picture: ${oldFilePath}`);
        }
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
        // We'll continue anyway as the update was successful
      }
    }

    // Get the updated user data
    const [updatedRows] = await pool.query(checkQuery, [id]);

    return {
      success: true,
      message: "Profile picture updated successfully",
      data: updatedRows[0],
    };
  } catch (error) {
    console.error("Profile Picture Update Error: ", error);
    return { success: false, message: "Failed to update profile picture" };
  }
};
