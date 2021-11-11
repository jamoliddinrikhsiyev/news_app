const { pooling, queries } = require("../modules/postgres.js");
const jwt = require("jsonwebtoken");
const { pages } = require("../lib/pages.js");
const key = process.env.TOKEN_KEY;
const limit = 10;

const allCommentsResolvers = {
  Query: {
    All_Comments: async (__, args) => {
      let obj = { info: [{}] };
      let arr = [obj];
      if (!args.page) {
        args.page = 1;
      }
      let { pagesCount, count } = await pages(10, "comments", args.news_id);
      obj.info[0].pages = pagesCount;
      obj.info[0].count = count;
      obj.info[0].next = pagesCount - args.page > 0 ? args.page : null;
      obj.info[0].prev = args.page - 1 > 0 ? args.page - 1 : null;
      let res = await pooling(queries.getCommentsbyNewsId, [
        args.news_id,
        limit * (args.page - 1),
        limit,
      ]);
      obj.results = await res;
      return arr;
    },
  },

  AllComments: {
    info: (data) => data.info,
    results: (data) => data.results,
  },

  Comments: {
    Comment_id: (data) => data.comment_id,
    Comment_message: (data) => data.comment_message,
    Comment_user: async (data) => data.comment_username,
    Comment_news_id: (data) => data.comment_news_id,
    Comment_date: (data) => String(data.comment_date),
  },
};

module.exports = { allCommentsResolvers };
