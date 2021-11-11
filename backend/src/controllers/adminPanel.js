const { pooling, queries } = require("../modules/postgres.js");
const path = require("path");
const jwt = require("jsonwebtoken");
const key = "please";

let imgName = "img_";
let imgCount = 1;

function adminPanelApis(req, res, dir) {
  console.log(req.files.file);
  let filename = `img/${imgName}${imgCount}.jpg`;
  req.files.file.mv(`${dir}/public/${filename}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      imgCount++;
      res.status(200).send(JSON.stringify({ file: filename }));
    }
  });
}

//post title
//post text
//post category
//post img
//token

function checkData(req) {
  let data = req.body;
  let files = req.files;
  let arr = [];
  if (!files) {
    arr.push("image");
  }
  if (!data.title) {
    arr.push("title");
  }
  if (!data.description) {
    arr.push("description");
  }
  if (!data.text) {
    arr.push("text");
  }
  if (!data.category) {
    arr.push("category");
  }
  if (!data.token) {
    arr.push("token");
  }
  return arr;
}

async function postNews(req, res, dir) {
  let data = req.body;
  let arr = checkData(req);
  if (arr.length != 0) {
    let send = arr.join(",");
    return res.status(404).json(`${send} is required`);
  } else if (arr.length == 0) {
    let user;
    try {
      user = jwt.verify(data.token, key);
    } catch (err) {
      console.log(err);
      return res.status(404).send("the token is wrong");
    }
    let myRe = /image\/.+/g;
    let img = req.files.image;
    if (user.admin == "true" && img.mimetype.match(myRe).length != 0) {
      let mimetype = img.name.match(/\.\w+/g);
      let filename = `img/${imgName}${imgCount}${mimetype}`;
      img.mv(`${dir}/public/${filename}`, (err) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          imgCount++;
        }
      });
      let category_id = await pooling(queries.getCategotybyName, [
        data.category,
      ]);
      let response = await pooling(queries.createNews, [
        data.title,
        data.description,
        data.text,
        category_id[0].id,
        filename,
      ]);
      res.status(200).send(JSON.stringify(response[0]));
    }
  }
}

module.exports = { postNews, adminPanelApis };
