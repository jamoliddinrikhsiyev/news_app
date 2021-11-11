const { pooling, queries } = require("../modules/postgres.js");
const { pages } = require("../lib/pages.js");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_KEY;
const limit = 10;

const usersResolvers = {
  Query: {
    users: async (__, args) => {
      let obj = { info: [{}] };
      let arr = [obj];
      let { pagesCount, count } = await pages(limit, "all_users");
      obj.info[0].pages = pagesCount;
      obj.info[0].count = count;

      let user = jwt.verify(args.token, key);
      if (user.admin == "true") {
        if (!args.page) {
          args.page = 1;
        }
        obj.info[0].next = pagesCount - args.page > 0 ? args.page + 1 : null;
        obj.info[0].prev = args.page - 1 > 0 ? args.page - 1 : null;

        obj.results = await pooling(queries.getAllUsers, [
          limit * (args.page - 1),
          limit,
        ]);
        return arr;
      } else {
        return [
          {
            status: 404,
            id: 0,
            name: "false",
            img: "false",
            role: "false",
            date: "false",
          },
        ];
      }
    },
  },

  Users: {
    info: (data) => data.info,
    results: (data) => data.results,
  },

  User: {
    User_id: (data) => {
      return data.id;
    },
    User_name: (data) => data.name,
    User_img: (data) => data.img,
    User_role: (data) => data.role,
    User_date: (data) => data.date,
  },
};

module.exports = { usersResolvers };
