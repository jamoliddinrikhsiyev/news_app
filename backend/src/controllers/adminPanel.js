const { pooling, queries } = require("../modules/postgres.js");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const uniqueFilename = require("unique-filename");
const key = "please";

function adminPanelApis(req, res) {}

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
  try {
    let insertData = [];
    let arr = [];
    let data = req.body;
    let files = req.files;

    if (data.header && data.description && data.data && data.category) {
      insertData[0] = data.header;
      insertData[1] = data.description;
      // console.log(data.data);
      let text = JSON.parse(data.data);
      for (let i = 1; i <= data.all; i++) {
        let obj = {};
        if (text[i]) {
          obj.text = text[i];
          arr.push(obj);
        } else if (files[i]) {
          // console.log(files[i], files[i].mimetype);
          let t = files[i].mimetype;
          let type = t.slice(t.indexOf("/") + 1);
          let filePath = "/files";
          let filename = `${uniqueFilename(filePath)}.${type}`;
          // console.log(filename);
          //D:\projects\nodejs\news_app\backend\src\assets\files\34d03a23.png
          await files[i].mv(
            path.join(process.cwd(), "src", "assets", filename),
            (err) => {
              if (err) console.log(err);
            }
          );
          // let filenamearr = filename.split(/\\/);
          // filename = `/${filenamearr[filenamearr.length - 2]}/${
          //   filenamearr[filenamearr.length - 1]
          // }`;
          // console.log("the filename: ", filename);
          obj.image = filename;
          arr.push(obj);
        }
      }
      insertData[2] = JSON.stringify({ array: arr });
      insertData[3] = Number(data.category);
      console.log(insertData);
      let response = await pooling(queries.createNews, insertData);
      console.log(response);
      if (response) {
        res.status(200).send(await response);
      } else if (!response) {
        res.status(400).send("error");
      }
    } else {
      res.status(400).send("error");
    }
  } catch (err) {
    console.log("error", err);
  }
}

module.exports = { postNews, adminPanelApis };

//'{"array":[{ "text" : "afdasdfasfdsafd" }, {"image": "http://localhost:8080/files/bc2082c5.jpeg"}]}'
