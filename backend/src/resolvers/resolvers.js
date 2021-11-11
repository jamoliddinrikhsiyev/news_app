const { pooling, queries } = require("../modules/postgres.js");
const { usersResolvers } = require("./users.js");
const { categoryResolvers } = require("./categories.js");
const { newsResolvers } = require("./all_news.js");
const { allCommentsResolvers } = require("./all_comments.js");
const { repliesResolvers } = require("./replies.js");
const { pages } = require("../lib/pages.js");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_KEY;
const limit = 10;

const resolvers = {
  user_role: {
    User: 0,
    Admin: 1,
  },

  Query: {
    users: usersResolvers.Query.users,
    Categories: categoryResolvers.Query.Categories,
    All_news: newsResolvers.Query.All_news,
    All_Comments: allCommentsResolvers.Query.All_Comments,
    All_Replies: repliesResolvers.Query.All_Replies,
  },

  User: usersResolvers.User,

  Category: categoryResolvers.Category,

  AllNews: newsResolvers.AllNews,

  AllComments: allCommentsResolvers.AllComments,

  Info: newsResolvers.Info,

  News: newsResolvers.News,

  Comments: allCommentsResolvers.Comments,

  Replies: repliesResolvers.Replies,

  Mutation: {
    Admins: async (__, args) => {
      let res = await pooling(queries.getAdmin, [args.username, args.password]);
      if (res) {
        return await res;
      } else {
        return [{ id: "false" }];
      }
    },
    SignIn: async (__, args) => {
      let user = await pooling(queries.getUserIdbyName, [
        args.username,
        args.password,
      ]);
      if (await user) {
        return user;
      } else {
        [
          {
            status: 404,
            token: "user or password wrong",
            name: "false",
          },
        ];
      }
    },
    SignUp: async (__, args) => {
      let user = await pooling(queries.getUser, [args.username]);
      if (user.length == 0) {
        let newUser = await pooling(queries.createUser, [
          args.username,
          args.password,
          args.email,
        ]);
        return await newUser;
      } else {
        return [
          {
            status: 404,
            token: "this user has already exist",
            name: "false",
          },
        ];
      }
    },
    CreateComment: async (__, args) => {
      let id = jwt.verify(args.token, key);
      let res = await pooling(queries.createComment, [
        args.message,
        args.news_id,
        id,
      ]);
      return await res;
    },
    CreateReply: async (__, args) => {
      let id = jwt.verify(args.token, key);
      let res = await pooling(queries.createComment, [
        args.message,
        args.comment_id,
        id,
      ]);
      if (await res) {
        return await res;
      }
    },
    AddRating: async (__, args) => {
      if (args.rating > 0 && args.rating <= 5) {
        let res = await pooling(queries.addRating, [args.newsId, args.rating]);
        return await res;
      }
    },
    AddCategory: async (__, args) => {
      let tokenVer = jwt.verify(args.token, key);
      if (tokenVer.admin == "true") {
        let res = await pooling(queries.addCategory, [args.category]);
        return await res;
      }
    },
  },

  Admin: {
    Status: (data) => {
      if (data) {
        return 200;
      }
    },
    Token: (data) => {
      if (data.id != "false") {
        let obj = { admin: "true", id: data.id };
        let token = jwt.sign(obj, key);
        return token;
      }
    },
  },

  NewUser: {
    Status: (data) => {
      if (data.id) {
        return 200;
      } else if (data.status == 404) {
        return data.status;
      }
    },
    Token: (data) => {
      if (data.id) {
        let token = jwt.sign(data.id, key);
        return token;
      } else if (data.status == 404) {
        return data.status;
      }
    },
    Name: (data) => {
      if (data.id) {
        return data.name;
      } else if (data.status == 404) {
        return data.name;
      }
    },
  },

  NewComment: {
    Comment_status: (data) => {
      if (data) {
        return 200;
      }
    },
    Comment: async (data) => {
      if (data.id) {
        let res = await pooling(queries.getCommentsbyCommentId, [data.id]);
        return await res;
      }
    },
  },

  NewReply: {
    Reply_status: (data) => {
      if (data) {
        return 200;
      }
    },
    Reply: async (data) => {
      if (data) {
        let res = await pooling(queries.getRepliesbyReplyId, [data.id]);
        return await res;
      }
    },
  },

  NewRating: {
    status: (data) => {
      if (data) return 200;
      else return 404;
    },
    rating: (data) => data.rating,
    news_id: (data) => data.news_id,
  },
};

module.exports = resolvers;
