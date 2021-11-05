const { pooling, queries } = require("../modules/postgres.js");

async function pages(limits, query, args) {
  let q = {
    allUsers: `
        SELECT id FROM users
        WHERE deleted = 0
      `,
    allNews: `
        SELECT id FROM news
        WHERE deleted = 0
        ORDER BY date DESC
      `,
    categoryNews: `
        SELECT id FROM news
        WHERE deleted = 0 AND category_id = $1
        ORDER BY date DESC
      `,
    comment: `
        SELECT id FROM comments
        WHERE deleted = 0 AND news_id = $1
        ORDER BY date DESC
      `,
    replies: `
        SELECT id FROM reply
        WHERE deleted = 0 AND comment_id = $1
        ORDER BY date DESC
      `,
  };
  let res;
  if (query == "all_news") {
    res = await pooling(q.allNews);
  } else if (query == "comments" && args) {
    res = await pooling(q.comment, [args]);
  } else if (query == "category_news" && args) {
    res = await pooling(q.categoryNews, [args]);
  } else if (query == "replies" && args) {
    res = await pooling(q.replies, [args]);
  } else if (query == "all_users") {
    res = await pooling(q.allUsers);
  }
  let pagesCount = Math.ceil(res.length / limits);
  let obj = {
    pagesCount,
    count: await res.length,
  };
  return obj;
}

module.exports = { pages };
