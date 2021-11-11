const host = require("./lib/getIp.js")(false);
const PORT = process.env.PORT || 8080;

const postgresConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
};

module.exports = {
  host,
  PORT,
  postgresConfig,
};
