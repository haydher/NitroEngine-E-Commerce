const { User } = require("../models/user");
const { Item } = require("../models/item");
const { Hero } = require("../models/hero");
const { Collection } = require("../models/collection");
const getUserId = require("../middleware/getUserId");
const ejs = require("ejs");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const express = require("express");
const dotenv = require("dotenv").config();
const session = require("express-session");
const router = express.Router();

router.use(
 session({
  secret: process.env.SECRET_SESSION_TOKEN,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb://localhost/NitroEngine" }),
 })
);

router.get("/",getUserId, async (req, res) => {
 let user = await User.findById(req.userId).select("-password")

 if(user?.length < 1 || !user || user == null) user = undefined

 let heroResult = await Hero.find()
 if (!heroResult || heroResult.length < 1) return res.status(500).send('Hero couldnt be found.');
 
 let collectionResult = await Collection.find()
 if (!collectionResult) return res.status(500).send('Hero couldnt be found.');

 let item = await Item.find()
 if (!item) return res.status(500).send('Invalid Search.');

 if (user != undefined && item.length > 0 &&  heroResult.length > 0 &&  collectionResult.length > 0)
  return res.render("index", { user, item, heroResult, collectionResult });
 else if (item == undefined || item.length < 1 || 
  heroResult == undefined || heroResult.length < 1|| 
  collectionResult == undefined || collectionResult.length < 1) return res.status(404).send("Page not found")

 res.render("index", {item, heroResult,collectionResult})
});

module.exports = router;
