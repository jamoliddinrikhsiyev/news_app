console.clear();
const express = require("express");
const path = require("path");
const { PORT, host } = require("./config.js");
const app = express();
const os = require("os");
let uniqueFilename = require("unique-filename");

let randomTmpfile = uniqueFilename(path.join(__dirname, "assets", "upload"));
console.log(randomTmpfile);

app.use(express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/single", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "single.html"));
});

app.get("/categoryfirst", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "category-01.html"));
});

app.get("/categorysecond", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "category-02.html"));
});

app.get("/categorythird", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "category-03.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

app.get("/author", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "author.html"));
});

app.get("/news/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "single.html"));
});

app.listen(PORT, () =>
  console.log(
    `server run in http://localhost:${PORT} or http://${host}:${PORT}`
  )
);
