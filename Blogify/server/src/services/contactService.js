import { pool } from "../config/db.js";

export const createContactQuery = async (contact) => {
  try {
    const query = `INSERT INTO contact (fullname, email, message) VALUES (?, ?, ?);`;
    const values = [contact.fullname, contact.email, contact.message];

    await pool.query(query, values);
    return { success: true, message: "Message added successfully" };
  } catch (error) {
    console.error("Error adding contact data: ", error);
    return { success: false, message: "Failed to add contact data" };
  }
};
