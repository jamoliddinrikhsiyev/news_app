const PORT = process.env.PORT || 5050;
const host = require("./lib/getIp.js")(false);

module.exports = { PORT, host };
