import { pool } from "./config/db.js";

async function alterUsersTable() {
  try {
    console.log("Starting table migration...");

    // Check if the phone column exists
    const [phoneColumns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'phone';
    `);

    // Check if the address column exists
    const [addressColumns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'address';
    `);

    // Check if the profile_picture column exists
    const [profilePictureColumns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_picture';
    `);

    // Add phone column if it doesn't exist
    if (phoneColumns.length === 0) {
      console.log("Adding phone column to users table...");
      await pool.query(
        `ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL;`
      );
      console.log("Phone column added successfully.");
    } else {
      console.log("Phone column already exists.");
    }

    // Add address column if it doesn't exist
    if (addressColumns.length === 0) {
      console.log("Adding address column to users table...");
      await pool.query(
        `ALTER TABLE users ADD COLUMN address TEXT DEFAULT NULL;`
      );
      console.log("Address column added successfully.");
    } else {
      console.log("Address column already exists.");
    }

    // Add profile_picture column if it doesn't exist
    if (profilePictureColumns.length === 0) {
      console.log("Adding profile_picture column to users table...");
      await pool.query(
        `ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL;`
      );
      console.log("Profile picture column added successfully.");
    } else {
      console.log("Profile picture column already exists.");
    }

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration Error:", error);
    process.exit(1);
  }
}

// Run the migration
alterUsersTable();
