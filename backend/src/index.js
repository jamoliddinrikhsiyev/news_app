console.clear();
const { ApolloServer } = require("apollo-server-express");
const { host, PORT } = require("./config.js");
const typeDefs = require("./schema/schema.js");
const resolvers = require("./resolvers/resolvers.js");
const adminPanelApis = require("./models/adminPanel.js");
const express = require("express");
const session = require("express-session");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "you secret key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: "strict",
    },
  })
);

server.applyMiddleware({ app });

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("<h1 style='color: red;'>hello world</h1>");
});

app.post("/api/adminpanel/postnews", (req, res) => {
  adminPanelApis(req, res);
});

app.listen(PORT, () => {
  console.log(
    `server running at http://localhost:${PORT} or http://${host}:${PORT} graphQl-server: http://localhost:${PORT}${server.graphqlPath}`
  );
});
