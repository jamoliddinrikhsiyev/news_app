const { pooling, queries } = require("../modules/postgres.js");
const jwt = require("jsonwebtoken");
const { pages } = require("../lib/pages.js");
const key = process.env.TOKEN_KEY;
const limit = 10;

const newsResolvers = {
  Query: {
    All_news: async (__, args) => {
      let obj = {
        info: [{}],
      };
      let arr = [obj];
      let p;
      if (Object.keys(args).length == 0 || (args.page && !args.category)) {
        if (!args.page) {
          args.page = 1;
        }
        p = await pages(limit, "all_news");
        let res = await pooling(queries.getAllNews, [
          limit * (args.page - 1),
          limit,
        ]);
        obj.results = await res;
      } else if (args.category) {
        let cId = await pooling(queries.getCategotybyName, [args.category]);
        let res = await pooling(queries.getNewsbyCategory, [await cId[0].id]);
        if (!args.page) {
          args.page = 1;
        }
        p = await pages(10, "category_news", args.category);
        res = await pooling(queries.getNewsbyCategory, [
          args.category,
          limit * (args.page - 1),
          limit,
        ]);
        obj.results = await res;
      }

      let { pagesCount, count } = p;
      obj.info[0].pages = pagesCount;
      obj.info[0].count = count;
      obj.info[0].next = pagesCount - args.page > 0 ? args.page + 1 : null;
      obj.info[0].prev = args.page - 1 > 0 ? args.page - 1 : null;

      return arr;
    },
  },

  AllNews: {
    info: (data) => data.info,
    results: (data) => data.results,
  },

  Info: {
    count: (data) => data.count,
    pages: (data) => data.pages,
    next: (data) => data.next,
    prev: (data) => data.prev,
  },

  News: {
    News_id: (data) => data.news_id,
    News_title: (data) => data.news_title,
    News_description: (data) => data.news_description,
    News_text: (data) => data.news_text,
    News_counter: (data) => data.news_counter,
    News_category: (data) => data.news_category_name,
    News_image: (data) => data.news_image,
    News_rating: async (data) => {
      let res = await pooling(queries.getAllRating, [data.id]);
      if (res.length != 0) {
        let a = 0;
        for (let i of await res) {
          a = a + i.rating;
        }
        let b = a / (await res.length);
        return await b;
      } else if (res.length == 0) {
        return data.news_rating;
      }
    },
    News_date: (data) => {
      console.log(String(data.news_date));
      return String(data.news_date);
    },
  },
};

module.exports = { newsResolvers };
