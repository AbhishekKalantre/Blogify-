import { pool } from "../config/db.js";

const contactTableQuery = `CREATE TABLE IF NOT EXISTS contact(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const commentsTableQuery = `CREATE TABLE IF NOT EXISTS comments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    post_type VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const usersTableQuery = `CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Drop table queries
const dropBlogPostsQuery = `DROP TABLE IF EXISTS blog_posts`;
const dropNewsArticlesQuery = `DROP TABLE IF EXISTS news_articles`;
const dropStoriesQuery = `DROP TABLE IF EXISTS stories`;
const dropTagsQuery = `DROP TABLE IF EXISTS tags`;

const tagsTableQuery = `CREATE TABLE IF NOT EXISTS tags(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT '#6366F1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const blogPostsTableQuery = `CREATE TABLE IF NOT EXISTS blog_posts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    imageUrl TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const newsArticlesTableQuery = `CREATE TABLE IF NOT EXISTS news_articles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    imageUrl TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const storiesTableQuery = `CREATE TABLE IF NOT EXISTS stories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    imageUrl TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const createTable = async (tableName, query) => {
  try {
    await pool.execute(query);
    console.log(`${tableName} table created or already exists`);
  } catch (error) {
    console.error(`Error creating ${tableName} table:`, error);
  }
};

const dropTable = async (tableName, query) => {
  try {
    await pool.execute(query);
    console.log(`${tableName} table dropped if it existed`);
  } catch (error) {
    console.error(`Error dropping ${tableName} table:`, error);
  }
};

// Insert default tags
const insertDefaultTags = async () => {
  try {
    const defaultTags = [
      {
        name: "technology",
        description: "Posts about technology and digital innovation",
        color: "#2563eb",
      },
      {
        name: "programming",
        description: "Code, software development, and programming languages",
        color: "#7c3aed",
      },
      {
        name: "health",
        description: "Health, wellness, and medical topics",
        color: "#16a34a",
      },
      {
        name: "business",
        description: "Business, entrepreneurship, and finance",
        color: "#ca8a04",
      },
      {
        name: "lifestyle",
        description: "Lifestyle, personal development, and self-improvement",
        color: "#db2777",
      },
      {
        name: "news",
        description: "Current events and breaking news",
        color: "#dc2626",
      },
      {
        name: "education",
        description: "Learning, teaching, and educational resources",
        color: "#0891b2",
      },
      {
        name: "entertainment",
        description: "Movies, music, games, and other entertainment",
        color: "#9333ea",
      },
    ];

    // Check if tags already exist
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM tags");
    if (rows[0].count === 0) {
      // Insert default tags
      for (const tag of defaultTags) {
        await pool.query(
          "INSERT INTO tags (name, description, color) VALUES (?, ?, ?)",
          [tag.name, tag.description, tag.color]
        );
      }
      console.log("Default tags inserted successfully");
    } else {
      console.log("Tags already exist, skipping default tags insertion");
    }
  } catch (error) {
    console.error("Error inserting default tags:", error);
  }
};

const createAllTables = async () => {
  try {
    await createTable("contact", contactTableQuery);
    await createTable("comments", commentsTableQuery);
    await createTable("users", usersTableQuery);

    // Create tags table
    await createTable("tags", tagsTableQuery);

    // Drop and recreate content tables with updated schema
    await dropTable("blog_posts", dropBlogPostsQuery);
    await dropTable("news_articles", dropNewsArticlesQuery);
    await dropTable("stories", dropStoriesQuery);

    await createTable("blog_posts", blogPostsTableQuery);
    await createTable("news_articles", newsArticlesTableQuery);
    await createTable("stories", storiesTableQuery);

    // Insert default tags
    await insertDefaultTags();

    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

export default createAllTables;
