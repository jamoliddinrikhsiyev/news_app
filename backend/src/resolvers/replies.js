const { pooling, queries } = require("../modules/postgres.js");
const { pages } = require("../lib/pages.js");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_KEY;
const limit = 10;

const repliesResolvers = {
  Query: {
    All_Replies: async (__, args) => {
      let obj = { info: [{}] };
      let arr = [obj];
      if (!args.page) {
        args.page = 1;
      }
      let { pagesCount, count } = await pages(10, "replies", args.comments_id);
      obj.info[0].pages = pagesCount;
      obj.info[0].count = count;
      obj.info[0].next = pagesCount - args.page > 0 ? args.page : null;
      obj.info[0].prev = args.page - 1 > 0 ? args.page - 1 : null;
      let res = await pooling(queries.getRepliesbyCommentId, [
        args.comments_id,
        limit * (args.page - 1),
        limit,
      ]);
      obj.results = res;
      return arr;
    },
  },

  AllReplies: {
    info: (data) => data.info,
    results: (data) => data.results,
  },

  Replies: {
    Reply_id: (data) => data.reply_id,
    Reply_message: (data) => data.reply_message,
    Reply_comment_id: (data) => data.reply_comment_id,
    Reply_user: (data) => data.reply_username,
    Reply_date: (data) => String(data.reply_date),
  },
};

module.exports = { repliesResolvers };
