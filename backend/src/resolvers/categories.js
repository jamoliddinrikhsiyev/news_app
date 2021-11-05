const { pooling, queries } = require("../modules/postgres.js");
const jwt = require("jsonwebtoken");
const { pages } = require("../lib/pages.js");
const key = "please";
const limit = 10;

const categoryResolvers = {
  Query: {
    Categories: async () => {
      let res = await pooling(queries.getAllCategories);
      return await res;
    },
  },

  Category: {
    Category_id: (data) => data.id,
    Category_name: (data) => data.name,
    Category_date: (data) => data.date,
  },
};

module.exports = { categoryResolvers };
