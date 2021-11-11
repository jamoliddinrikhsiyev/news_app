console.clear();

/*-- import modules --*/
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const result = require("dotenv").config();
const path = require("path");

if (result.error) {
  throw result.error;
}

/*-- import functions | objects --*/
const { host, PORT } = require("./config.js");
const typeDefs = require("./schema/schema.js");
const resolvers = require("./resolvers/resolvers.js");
const { postNews, adminPanelApis } = require("./controllers/adminPanel.js");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/*-- createserver --*/
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

/*-- app set --*/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
server.applyMiddleware({ app });

/*-- routes --*/
app.get("/", (req, res) => {
  res.send("<h1 style='color: red;'>hello world</h1>");
});

app.post("/api/adminpanel/postnews", (req, res) => {
  postNews(req, res, __dirname);
});

/*-- listen server --*/
app.listen(PORT, () => {
  console.log(
    `server running at http://localhost:${PORT} or http://${host}:${PORT} graphQl-server: http://localhost:${PORT}${server.graphqlPath}`
  );
});
