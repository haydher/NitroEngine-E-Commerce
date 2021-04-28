const { User } = require("../models/user");
const { Item } = require("../models/item");
const { Hero } = require("../models/hero");
const { Collection } = require("../models/collection");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();

router.use(express.urlencoded({ extended: true }));

router.get("/", [authToken], async (req, res) => {

 let user = await User.findById(req.userId).select("-password");
 if(user == undefined) user = undefined
 let searchField = req.query.collections || req.query.search

 item = await Item.find()
 if (!item) return res.status(400).send('Invalid Search.');

 let genderSearch = `${getUpperCase(req.query?.gender)} ${getUpperCase(req.query?.category)}`
 // for collections
 if(req.query.gender) {
  let searchResult = await Item.find({gender: { $regex : new RegExp(req.query.gender, "i")} , category: req.query.category})
  if(searchResult == undefined || searchResult.length < 1)
   return res.status(404).send("no item with that search found")
  if (user != undefined && searchResult != undefined && searchResult.length > 0)
   return res.render("itemPage", { user, item,  searchResult, searchField : genderSearch });
  else return res.render("itemPage", { item,  searchResult, searchField : genderSearch });
 }

 // for colors and search field
 if(searchField) {
  let searchResult = await Item.find({$text: {$search : `${searchField}`}}, {score: {$meta: "textScore"}})
    .sort({score: {$meta: "textScore"}})
  if(searchResult == undefined || searchResult.length < 1)
   return res.status(404).send("no item with that search found")
  if (user != undefined && searchResult != undefined && searchResult.length > 0)
   return res.render("itemPage", { user, item, searchResult, searchField : getUpperCase(searchField) });
  else return res.render("itemPage", { item,  searchResult, searchField : genderSearch });
  }else if(searchField == undefined && req.query.gender == undefined)
  return res.status(404).send("no item with that search found")
});

router.get("/catalog", [authToken, reqLoginTrue, admin], async (req, res) => {

 const user = await User.findById(req.userId).select("-password");

 item = await Item.find()
 .populate("author", "-password -phone")
 if (!item) return res.status(400).send('Invalid Search.');

 if (user != undefined && item != undefined && item.length > 0) return res.render("catalog", { user, item });
 else if ( item == undefined || item.length < 1) return res.status(404).send("Page not found")
 res.render("catalog", {item})
});

router.get("/catalog/hero", [authToken, reqLoginTrue, admin], async (req, res) => {

  const user = await User.findById(req.userId).select("-password");
 
  let hero = await Hero.find()
  .populate("author", "-password -phone")
  if (!hero) return res.status(400).send('No Hero Exists.');
  if (user != undefined && hero != undefined && hero.length > 0) return res.render("heroCatalog", { user, hero });
  else if ( hero == undefined || hero.length < 1) return res.status(404).send("Page not found")
  res.render("heroCatalog", {hero})
 });

router.get("/catalog/collections", [authToken, reqLoginTrue, admin], async (req, res) => {

  const user = await User.findById(req.userId).select("-password");
 
  let collection = await Collection.find()
  .populate("author", "-password -phone")
  if (!collection) return res.status(400).send('No Hero Exists.');
  if (user != undefined && collection != undefined && collection.length > 0) return res.render("collectionCatalog", { user, collection });
  else if ( collection == undefined || collection.length < 1) return res.status(404).send("Page not found")
  res.render("collectionCatalog", {collection})
});

 
router.post("/searchResult", [authToken], async (req, res) => {
  console.log("SEARCH RESULT", req.body.searchValue)

  const user = await User.findById(req.userId).select("-password");

  let searchValue = req.body.searchValue
  console.log(searchValue)
  if(req.body.searchValue) {
    let searchResult = await Item.find({$text: {$search:{ $regex: `${searchValue}`, $options: "i" } }}, {score: {$meta: "textScore"}})
      .sort({score: {$meta: "textScore"}}).limit(10)
    if(searchResult == undefined || searchResult.length < 1)
     return res.json("no results found")
    if (user != undefined && searchResult != undefined && searchResult.length > 0)
     return res.json(searchResult);
   }
 
  if (user != undefined && item != undefined && item.length > 0) return res.render("catalog", { user, item });
  else if ( item == undefined || item.length < 1) return res.status(404).send("Page not found")
  // res.render("catalog", {item})
  res.json()
});

function getUpperCase(string){
 if (typeof string !== 'string') return ''
 return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = router;


/* 


const { User } = require("../models/user");
const { Item } = require("../models/item");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const getUserId = require("../middleware/getUserId");
const express = require("express");
const passport = require("passport");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();

router.use(express.urlencoded({ extended: true }));

router.use(passport.initialize());
router.use(passport.session());

router.get("/", getUserId, async (req, res) => {
 let user = await User.findById(req.userId).select("-password");
 if(user == undefined) user = undefined

 let searchField = req.query.collections || req.query.search

 item = await Item.find()
 if (!item) return res.status(400).send('Invalid Search.');

 let genderSearch = `${getUpperCase(req.query?.gender)} ${getUpperCase(req.query?.category)}`
 // for collections
 if(req.query.gender) {
  let searchResult = await Item.find({gender: { $regex : new RegExp(req.query.gender, "i")} , category: req.query.category})
  if(searchResult == undefined || searchResult.length < 1)
   return res.status(404).send("no item with that search found")
  if (user != undefined && searchResult != undefined && searchResult.length > 0)
   return res.render("itemPage", { user, item,  searchResult, searchField : genderSearch });
  else return res.render("itemPage", { item,  searchResult, searchField : genderSearch });
 }

 // for colors and search field
 if(searchField) {
  let searchResult = await Item.find({$text: {$search : `${searchField}`}}, {score: {$meta: "textScore"}})
    .sort({score: {$meta: "textScore"}})
  if(searchResult == undefined || searchResult.length < 1)
   return res.status(404).send("no item with that search found")
  if (user != undefined && searchResult != undefined && searchResult.length > 0)
   return res.render("itemPage", { user, item, searchResult, searchField : getUpperCase(searchField) });
  else return res.render("itemPage", { item,  searchResult, searchField : genderSearch });
  }else if(searchField == undefined && req.query.gender == undefined)
  return res.status(404).send("no item with that search found")
});


router.get("/catalog", [reqLoginTrue, admin, getUserId], async (req, res) => {

 console.log("IS AUTHENTICATED ",req.isAuthenticated())

 const user = await User.findById(req.userId).select("-password");

 item = await Item.find()
 .populate("author", "-password -phone")
 if (!item) return res.status(400).send('Invalid Search.');

 if (user != undefined && item != undefined && item.length > 0) return res.render("catalog", { user, item });
 else if ( item == undefined || item.length < 1) return res.status(404).send("Page not found")
 res.render("catalog", {item})
});


router.post("/searchResult", getUserId, async (req, res) => {
  console.log("SEARCH RESULT", req.body.searchValue)

  const user = await User.findById(req.userId).select("-password");

  let searchValue = req.body.searchValue
  console.log(searchValue)
  if(req.body.searchValue) {
    let searchResult = await Item.find({$text: {$search:{ $regex: `${searchValue}`, $options: "i" } }}, {score: {$meta: "textScore"}})
      .sort({score: {$meta: "textScore"}}).limit(10)
    if(searchResult == undefined || searchResult.length < 1)
     return res.json("no results found")
    if (user != undefined && searchResult != undefined && searchResult.length > 0)
     return res.json(searchResult);
   }
 
  if (user != undefined && item != undefined && item.length > 0) return res.render("catalog", { user, item });
  else if ( item == undefined || item.length < 1) return res.status(404).send("Page not found")
  // res.render("catalog", {item})
  res.json()
});


function getUpperCase(string){
 if (typeof string !== 'string') return ''
 return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = router;











*/