import { pool } from "../config/db.js";

// Blog Post Services
export const createBlogPostQuery = async (blog) => {
  try {
    const query = `INSERT INTO blog_posts (title, author, imageUrl, excerpt, content, tags) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [
      blog.title,
      blog.author,
      blog.imageUrl,
      blog.excerpt,
      blog.content,
      JSON.stringify(blog.tags || []),
    ];

    console.log("Executing blog post query with values:", values);
    const [result] = await pool.query(query, values);
    console.log("Blog post query result:", result);

    return {
      success: true,
      message: "Blog post created successfully",
      postId: result.insertId,
    };
  } catch (error) {
    console.error("Error creating blog post: ", error);
    return { success: false, message: "Failed to create blog post" };
  }
};

export const getAllBlogPostsQuery = async () => {
  try {
    const query = `SELECT * FROM blog_posts ORDER BY created_at DESC;`;
    const [rows] = await pool.query(query);

    // Parse the JSON tags
    const posts = rows.map((post) => ({
      ...post,
      tags: JSON.parse(post.tags || "[]"),
    }));

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching blog posts: ", error);
    return { success: false, message: "Failed to fetch blog posts" };
  }
};

// Get a single blog post by ID
export const getBlogPostQuery = async (id) => {
  try {
    const query = `SELECT * FROM blog_posts WHERE id = ?;`;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return { success: false, message: "Blog post not found" };
    }

    // Parse JSON tags
    const post = {
      ...rows[0],
      tags: JSON.parse(rows[0].tags || "[]"),
    };

    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching blog post: ", error);
    return { success: false, message: "Failed to fetch blog post" };
  }
};

// Update a blog post
export const updateBlogPostQuery = async (id, blog) => {
  try {
    const query = `
      UPDATE blog_posts 
      SET title = ?, author = ?, imageUrl = ?, excerpt = ?, content = ?, tags = ?, updated_at = NOW() 
      WHERE id = ?;
    `;

    const values = [
      blog.title,
      blog.author,
      blog.imageUrl,
      blog.excerpt,
      blog.content,
      JSON.stringify(blog.tags || []),
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return { success: false, message: "Blog post not found or not updated" };
    }

    return {
      success: true,
      message: "Blog post updated successfully",
    };
  } catch (error) {
    console.error("Error updating blog post: ", error);
    return { success: false, message: "Failed to update blog post" };
  }
};

// Delete a blog post
export const deleteBlogPostQuery = async (id) => {
  try {
    const query = `DELETE FROM blog_posts WHERE id = ?;`;
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return { success: false, message: "Blog post not found" };
    }

    return {
      success: true,
      message: "Blog post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting blog post: ", error);
    return { success: false, message: "Failed to delete blog post" };
  }
};

// News Article Services
export const createNewsArticleQuery = async (news) => {
  try {
    const query = `INSERT INTO news_articles (title, author, imageUrl, excerpt, content, tags) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [
      news.title,
      news.author,
      news.imageUrl,
      news.excerpt,
      news.content,
      JSON.stringify(news.tags || []),
    ];

    console.log("Executing news article query with values:", values);
    const [result] = await pool.query(query, values);
    console.log("News article query result:", result);

    return {
      success: true,
      message: "News article created successfully",
      postId: result.insertId,
    };
  } catch (error) {
    console.error("Error creating news article: ", error);
    return { success: false, message: "Failed to create news article" };
  }
};

export const getAllNewsArticlesQuery = async () => {
  try {
    const query = `SELECT * FROM news_articles ORDER BY created_at DESC;`;
    const [rows] = await pool.query(query);

    // Parse the JSON tags
    const articles = rows.map((article) => ({
      ...article,
      tags: JSON.parse(article.tags || "[]"),
    }));

    return { success: true, data: articles };
  } catch (error) {
    console.error("Error fetching news articles: ", error);
    return { success: false, message: "Failed to fetch news articles" };
  }
};

// Get a single news article by ID
export const getNewsArticleQuery = async (id) => {
  try {
    const query = `SELECT * FROM news_articles WHERE id = ?;`;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return { success: false, message: "News article not found" };
    }

    // Parse JSON tags
    const article = {
      ...rows[0],
      tags: JSON.parse(rows[0].tags || "[]"),
    };

    return { success: true, data: article };
  } catch (error) {
    console.error("Error fetching news article: ", error);
    return { success: false, message: "Failed to fetch news article" };
  }
};

// Update a news article
export const updateNewsArticleQuery = async (id, news) => {
  try {
    const query = `
      UPDATE news_articles 
      SET title = ?, author = ?, imageUrl = ?, excerpt = ?, content = ?, tags = ?, updated_at = NOW() 
      WHERE id = ?;
    `;

    const values = [
      news.title,
      news.author,
      news.imageUrl,
      news.excerpt,
      news.content,
      JSON.stringify(news.tags || []),
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "News article not found or not updated",
      };
    }

    return {
      success: true,
      message: "News article updated successfully",
    };
  } catch (error) {
    console.error("Error updating news article: ", error);
    return { success: false, message: "Failed to update news article" };
  }
};

// Delete a news article
export const deleteNewsArticleQuery = async (id) => {
  try {
    const query = `DELETE FROM news_articles WHERE id = ?;`;
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return { success: false, message: "News article not found" };
    }

    return {
      success: true,
      message: "News article deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting news article: ", error);
    return { success: false, message: "Failed to delete news article" };
  }
};

// Story Services
export const createStoryQuery = async (story) => {
  try {
    const query = `INSERT INTO stories (title, author, imageUrl, excerpt, content, tags) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [
      story.title,
      story.author,
      story.imageUrl,
      story.excerpt,
      story.content,
      JSON.stringify(story.tags || []),
    ];

    console.log("Executing story query with values:", values);
    const [result] = await pool.query(query, values);
    console.log("Story query result:", result);

    return {
      success: true,
      message: "Story created successfully",
      postId: result.insertId,
    };
  } catch (error) {
    console.error("Error creating story: ", error);
    return { success: false, message: "Failed to create story" };
  }
};

export const getAllStoriesQuery = async () => {
  try {
    const query = `SELECT * FROM stories ORDER BY created_at DESC;`;
    const [rows] = await pool.query(query);

    // Parse the JSON tags
    const stories = rows.map((story) => ({
      ...story,
      tags: JSON.parse(story.tags || "[]"),
    }));

    return { success: true, data: stories };
  } catch (error) {
    console.error("Error fetching stories: ", error);
    return { success: false, message: "Failed to fetch stories" };
  }
};

// Get a single story by ID
export const getStoryQuery = async (id) => {
  try {
    const query = `SELECT * FROM stories WHERE id = ?;`;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return { success: false, message: "Story not found" };
    }

    // Parse JSON tags
    const story = {
      ...rows[0],
      tags: JSON.parse(rows[0].tags || "[]"),
    };

    return { success: true, data: story };
  } catch (error) {
    console.error("Error fetching story: ", error);
    return { success: false, message: "Failed to fetch story" };
  }
};

// Update a story
export const updateStoryQuery = async (id, story) => {
  try {
    const query = `
      UPDATE stories 
      SET title = ?, author = ?, imageUrl = ?, excerpt = ?, content = ?, tags = ?, updated_at = NOW() 
      WHERE id = ?;
    `;

    const values = [
      story.title,
      story.author,
      story.imageUrl,
      story.excerpt,
      story.content,
      JSON.stringify(story.tags || []),
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return { success: false, message: "Story not found or not updated" };
    }

    return {
      success: true,
      message: "Story updated successfully",
    };
  } catch (error) {
    console.error("Error updating story: ", error);
    return { success: false, message: "Failed to update story" };
  }
};

// Delete a story
export const deleteStoryQuery = async (id) => {
  try {
    const query = `DELETE FROM stories WHERE id = ?;`;
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return { success: false, message: "Story not found" };
    }

    return {
      success: true,
      message: "Story deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting story: ", error);
    return { success: false, message: "Failed to delete story" };
  }
};
