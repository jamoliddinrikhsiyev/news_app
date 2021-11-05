const fileupload = require("express-fileupload");

function adminPanelApis(req, res) {
  console.log(req.session.id);
  req.session.save((err) => {
    if (err) console.log(err);
  });
  res.send("<h1>Admin Panel</h1>");
}

module.exports = adminPanelApis;
