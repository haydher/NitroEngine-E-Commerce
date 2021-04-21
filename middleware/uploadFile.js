const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { func } = require("joi");

// middleware
const fileStorage = multer.diskStorage({
 destination: (req, file, callback) => {
  if(file.fieldname == "heroCoverImg" || file.fieldname == "heroItemImg" ){
    const checkPath = path.join(__dirname + "/../public/imgUploads/hero");
    makeDir(checkPath)
    callback(null, `./public/imgUploads/hero`);
  }if(file.fieldname == "collectionImg"){
    const checkPath = path.join(__dirname + "/../public/imgUploads/collections");
    makeDir(checkPath)
    callback(null, `./public/imgUploads/collections`);
  } else if(file.fieldname == "images" ) {
    const checkPath = path.join(__dirname + "/../public/imgUploads/" + req.body.category);
    makeDir(checkPath)
    callback(null, `./public/imgUploads/${req.body.category}/`);
  }
 },
 filename: (req, file, callback) => {
  callback(null, file.originalname);
  // callback(null, `${Date.now()}_${file.originalname}`);
 },
});

function makeDir(dir){
try {
  if (!fs.existsSync(dir))
    fs.mkdir(dir, (err) => {
    if (err) return;
    });
  } catch (e) {
  console.log("An error occurred making folder.");
  }
}

module.exports = fileStorage;
