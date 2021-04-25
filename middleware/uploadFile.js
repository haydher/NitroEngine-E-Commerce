const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { func } = require("joi");

// middleware
const fileStorage = multer.diskStorage({
 destination: (req, file, callback) => {
    callback(null, `./public/images`);
 },
 filename: (req, file, callback) => {
  callback(null, file.originalname);
 },
});

module.exports = fileStorage;
