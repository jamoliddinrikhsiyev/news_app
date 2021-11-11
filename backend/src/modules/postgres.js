const { Pool } = require("pg");
const { postgresConfig } = require("../config.js");

const pool = new Pool(postgresConfig);

const queries = {
  getAdmins: `
    SELECT 
      id,
      name,
      img,
      role,
      date
    FROM users
    WHERE id = $1 AND role = 1 AND deleted = 0
  `,
  getAllUsers: `
    SELECT 
      id,
      name,
      img,
      role,
      date,
      deleted,
      deleted_time
    FROM users
    OFFSET $1 FETCH FIRST $2 ROW ONLY
  `,
  getAllNews: `
    SELECT
      news.id AS news_id,
      news.title AS news_title,
      news.description AS news_description,
      news.counter AS news_counter,
      categories.name AS news_category_name,
      news.image AS news_image,
      news.rating AS news_rating,
      news.date AS news_date
    FROM news INNER JOIN categories
    ON categories.id = news.category_id
    WHERE news.deleted = 0
    ORDER BY
      news.date DESC
    OFFSET $1 FETCH FIRST $2 ROW ONLY
  `,
  getAllCategories: `
    SELECT * FROM categories
  `,
  getAllComments: `
    SELECT
      comments.id AS comment_id,
      comments.message AS comment_message,
      comments.news_id AS comment_news_id,
      users.name AS comment_username,
      comments.date AS comment_date
    FROM comments INNER JOIN users
    ON comments.user_id = users.id
    WHERE comments.deleted = 0
    ORDER BY comments.date DESC
    OFFSET $1 FETCH FIRST $2 ROW ONLY
  `,
  getNewsbyCategory: `
    SELECT
      news.id AS news_id,
      news.title AS news_title,
      news.description AS news_description,
      news.counter AS news_counter,
      categories.name AS news_category_name,
      news.image AS news_image,
      news.rating AS news_rating,
      news.date AS news_date
    FROM news INNER JOIN categories
    ON categories.id = news.category_id
    WHERE category_id = $1 AND news.deleted = 0
    ORDER BY
      news.date DESC
    OFFSET $2 FETCH FIRST $3 ROW ONLY
  `,
  getCategotybyName: `
    SELECT id FROM categories
    WHERE name = $1
  `,
  getAllRating: `
    SELECT * FROM rating
    WHERE news_id = $1
  `,
  getAdmin: `
    SELECT id FROM users
    WHERE role = 1 AND
    name = $1 AND
    password = $2
  `,
  getCommentsbyNewsId: `
    SELECT
      comments.id AS comment_id,
      comments.message AS comment_message,
      comments.news_id AS comment_news_id,
      users.name AS comment_username,
      comments.date AS comment_date
    FROM comments INNER JOIN users
    ON comments.user_id = users.id
    WHERE comments.news_id = $1 AND comments.deleted = 0
    OFFSET $2 FETCH FIRST $3 ROW ONLY
  `,
  getCommentsbyCommentId: `
    SELECT
      comments.id AS comment_id,
      comments.message AS comment_message,
      comments.news_id AS comment_news_id,
      users.name AS comment_username,
      comments.date AS comment_date
    FROM comments INNER JOIN users
    ON comments.user_id = users.id
    WHERE comments.id = $1
  `,
  getRepliesbyCommentId: `
    SELECT 
      reply.id AS reply_id,
      reply.message AS reply_message,
      reply.comment_id AS reply_comment_id,
      users.name AS reply_username,
      reply.date AS reply_date
    FROM reply INNER JOIN users
    ON reply.user_id = users.id
    WHERE reply.comment_id = $1 AND reply.deleted = 0
    OFFSET $2 FETCH FIRST $3 ROW ONLY
  `,
  getRepliesbyReplyId: `
    SELECT 
      reply.id AS reply_id,
      reply.message AS reply_message,
      reply.comment_id AS reply_comment_id,
      users.name AS reply_username,
      reply.date AS reply_date
    FROM reply INNER JOIN users
    ON reply.user_id = users.id
    WHERE reply.id = $1 AND reply.deleted = 0
  `,
  getUsernamebyId: `
    SELECT name FROM users WHERE id = $1
  `,
  getUserIdbyName: `
    SELECT id, name FROM users WHERE name = $1 AND password = $2 AND deleted = 0
  `,
  getUser: `
    SELECT id, name FROM users WHERE name = $1 AND deleted = 0
  `,
  createComment: `
    INSERT INTO comments (
      message,
      news_id,
      user_id
    )VALUES($1, $2, $3)
    RETURNING id, message
  `,
  createReply: `
    INSERT INTO reply (
      message,
      comment_id,
      user_id
    )VALUES($1, $2, $3)
    RETURNING id, message 
  `,
  createUser: `
    INSERT INTO users (
      name,
      password,
      email
    )VALUES($1, $2, $3)
    RETURNING id, name
  `,
  createNews: `
    INSERT INTO news(
      title,
      description,
      category_id,
      image
    )VALUES($1, $2, $3, $4)
    RETURNING title, description, category_id, image, counter, rating, date
  `,
};

async function pooling(request, array) {
  const client = await pool.connect();
  let res;
  if (request && !array) {
    res = await client.query(request);
  } else if (request && array) {
    res = await client.query(request, array);
  }
  client.release();
  return await res.rows;
}

module.exports = { pooling, queries };
