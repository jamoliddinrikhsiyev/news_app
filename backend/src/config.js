const host = require("./lib/getIp.js")(false);
const PORT = process.env.PORT || 8080;

const postgresConfig = {
  user: "postgres",
  host: "localhost",
  database: "news",
  password: "1111",
  port: 5432,
};

module.exports = {
  host,
  PORT,
  postgresConfig,
};
