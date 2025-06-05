import { pool } from "../config/db.js";

// Create a new tag
export const createTagQuery = async (tag) => {
  try {
    const query = `INSERT INTO tags (name, description, color) VALUES (?, ?, ?);`;
    const values = [tag.name, tag.description, tag.color];

    const [result] = await pool.query(query, values);

    return {
      success: true,
      message: "Tag created successfully",
      tagId: result.insertId,
    };
  } catch (error) {
    console.error("Error creating tag: ", error);
    return { success: false, message: "Failed to create tag" };
  }
};

// Get all tags
export const getAllTagsQuery = async () => {
  try {
    const query = `SELECT * FROM tags ORDER BY name ASC;`;
    const [rows] = await pool.query(query);

    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching tags: ", error);
    return { success: false, message: "Failed to fetch tags" };
  }
};

// Get a single tag by ID
export const getTagQuery = async (id) => {
  try {
    const query = `SELECT * FROM tags WHERE id = ?;`;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return { success: false, message: "Tag not found" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Error fetching tag: ", error);
    return { success: false, message: "Failed to fetch tag" };
  }
};

// Update a tag
export const updateTagQuery = async (id, tag) => {
  try {
    const query = `
      UPDATE tags 
      SET name = ?, description = ?, color = ?
      WHERE id = ?;
    `;

    const values = [tag.name, tag.description, tag.color, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return { success: false, message: "Tag not found or not updated" };
    }

    return {
      success: true,
      message: "Tag updated successfully",
    };
  } catch (error) {
    console.error("Error updating tag: ", error);
    return { success: false, message: "Failed to update tag" };
  }
};

// Delete a tag
export const deleteTagQuery = async (id) => {
  try {
    const query = `DELETE FROM tags WHERE id = ?;`;
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return { success: false, message: "Tag not found" };
    }

    return {
      success: true,
      message: "Tag deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting tag: ", error);
    return { success: false, message: "Failed to delete tag" };
  }
};

// Get tag usage count (how many posts use each tag)
export const getTagUsageCountQuery = async () => {
  try {
    // Simpler approach using LIKE operator to count tag usage
    const blogQuery = `
      SELECT t.name AS tag, COUNT(b.id) AS count
      FROM tags t
      LEFT JOIN blog_posts b ON b.tags LIKE CONCAT('%"', t.name, '"%')
      GROUP BY t.name;
    `;

    const newsQuery = `
      SELECT t.name AS tag, COUNT(n.id) AS count
      FROM tags t
      LEFT JOIN news_articles n ON n.tags LIKE CONCAT('%"', t.name, '"%')
      GROUP BY t.name;
    `;

    const storyQuery = `
      SELECT t.name AS tag, COUNT(s.id) AS count
      FROM tags t
      LEFT JOIN stories s ON s.tags LIKE CONCAT('%"', t.name, '"%')
      GROUP BY t.name;
    `;

    // Execute all queries in parallel
    const [blogResults, newsResults, storyResults] = await Promise.all([
      pool.query(blogQuery),
      pool.query(newsQuery),
      pool.query(storyQuery),
    ]);

    // Combine results from all three tables
    const tagCounts = {};

    // Process blog counts
    blogResults[0].forEach((row) => {
      tagCounts[row.tag] = (tagCounts[row.tag] || 0) + row.count;
    });

    // Process news counts
    newsResults[0].forEach((row) => {
      tagCounts[row.tag] = (tagCounts[row.tag] || 0) + row.count;
    });

    // Process story counts
    storyResults[0].forEach((row) => {
      tagCounts[row.tag] = (tagCounts[row.tag] || 0) + row.count;
    });

    return {
      success: true,
      data: Object.entries(tagCounts).map(([tag, count]) => ({ tag, count })),
    };
  } catch (error) {
    console.error("Error fetching tag usage counts: ", error);
    return {
      success: false,
      message: "Failed to fetch tag usage counts: " + error.message,
    };
  }
};
