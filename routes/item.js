const { User } = require("../models/user");
const { Item } = require("../models/item");
const { Hero } = require("../models/hero");
const { Collection } = require("../models/collection");
const { authToken } = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();

router.use(express.urlencoded({ extended: true }));

router.get("/", [authToken], async (req, res) => {
 console.log("in item page");
 let user = await User.findById(req.userId).select("-password");
 if (user == undefined) user = undefined;
 let searchField = req.query.collections || req.query.search;

 item = await Item.find();
 if (!item) return res.status(400).send("Invalid Search.");

 let genderSearch = `${getUpperCase(req.query?.gender)} ${getUpperCase(req.query?.category)}`;

 // for collections
 if (req.query.gender) {
  let searchResult = await Item.find({ gender: req.query.gender, category: req.query.category });
  if (searchResult == undefined || searchResult.length < 1) return res.status(404).render("404");
  if (user != undefined && searchResult != undefined && searchResult.length > 0)
   return res.render("itemPage", { user, item, searchResult, searchField: genderSearch });
  else return res.render("itemPage", { item, searchResult, searchField: genderSearch });
 }

 console.log("req.query", req.query);
 // for colors and search field
 if (searchField) {
  let searchResult = await Item.find({ $text: { $search: searchField } }, { score: { $meta: "textScore" } }).sort({
   score: { $meta: "textScore" },
  });
  if (searchResult == undefined || searchResult.length < 1) return res.status(404).render("404");
  if (user != undefined && searchResult != undefined && searchResult.length > 0)
   return res.render("itemPage", { user, item, searchResult, searchField: getUpperCase(searchField) });
  else return res.render("itemPage", { item, searchResult, searchField: genderSearch });
 } else if (searchField == undefined && req.query.gender == undefined) return res.status(404).render("404");
});

router.get("/catalog", [authToken, reqLoginTrue, admin], async (req, res) => {
 const user = await User.findById(req.userId).select("-password");

 item = await Item.find().populate("author", "-password -phone");
 if (!item) return res.status(400).send("Invalid Search.");

 if (user != undefined && item != undefined && item.length > 0) return res.render("catalog", { user, item });
 else if (item == undefined || item.length < 1) return res.status(404).render("404");
 res.render("catalog", { item });
});

router.get("/catalog/hero", [authToken, reqLoginTrue, admin], async (req, res) => {
 const user = await User.findById(req.userId).select("-password");

 let hero = await Hero.find().populate("author", "-password -phone");
 if (!hero) return res.status(400).send("No Hero Exists.");
 if (user != undefined && hero != undefined && hero.length > 0) return res.render("heroCatalog", { user, hero });
 else if (hero == undefined || hero.length < 1) return res.status(404).render("404");
 res.render("heroCatalog", { hero });
});

router.get("/catalog/collections", [authToken, reqLoginTrue, admin], async (req, res) => {
 const user = await User.findById(req.userId).select("-password");

 let collection = await Collection.find().populate("author", "-password -phone");
 if (!collection) return res.status(400).send("No Hero Exists.");
 if (user != undefined && collection != undefined && collection.length > 0)
  return res.render("collectionCatalog", { user, collection });
 else if (collection == undefined || collection.length < 1) return res.status(404).render("404");
 res.render("collectionCatalog", { collection });
});

router.post("/searchResult", [authToken], async (req, res) => {
 console.log("SEARCH RESULT", req.body.searchValue);

 const user = await User.findById(req.userId).select("-password");

 let searchValue = req.body.searchValue;
 console.log(searchValue);
 if (req.body.searchValue) {
  //{$text: {$search : `${searchField}`}}
  let searchResult = await Item.find(
   { $text: { $search: `${searchValue}`, $caseSensitive: false } },
   { score: { $meta: "textScore" } }
  )
   .sort({ score: { $meta: "textScore" } })
   .limit(10);
  if (searchResult == undefined || searchResult.length < 1) return res.json("no results found");
  console.log(searchResult);
  if (user != undefined && searchResult != undefined && searchResult.length > 0) return res.json(searchResult);
 }

 if (user != undefined && item != undefined && item.length > 0) return res.render("catalog", { user, item });
 else if (item == undefined || item.length < 1) return res.status(404).render("404");
 // res.render("catalog", {item})
 res.json();
});

router.post("/?", [authToken], async (req, res) => {
 let filterStr = Object.keys(req.body).join(" ");

 let user = await User.findById(req.userId).select("-password");
 if (user == undefined) user = undefined;

 // console.log(req.body.men)
 item = await Item.find();
 if (!item) return res.status(400).send("Invalid Search.");

 const limit = 3;
 let searchResult;
 let filteredResultStr = `Filtered Results`;

 if (req.body.men)
  searchResult = await Item.find({ $text: { $search: `${filterStr} -women` } }, { score: { $meta: "textScore" } })
   .sort({ score: { $meta: "textScore" } })
   .limit(limit);
 else if (req.body.women)
  searchResult = await Item.find({ $text: { $search: `${filterStr} -men` } }, { score: { $meta: "textScore" } })
   .sort({ score: { $meta: "textScore" } })
   .limit(limit);
 else
  searchResult = await Item.find({ $text: { $search: `${filterStr}` } }, { score: { $meta: "textScore" } })
   .sort({ score: { $meta: "textScore" } })
   .limit(limit);

 console.log("req.query", req.query);
 console.log("filterStr", filterStr);

 console.log("searchResult", searchResult);

 if (searchResult == undefined || searchResult.length < 1) return res.status(404).render("404");
 if (user != undefined && searchResult != undefined && searchResult.length > 0)
  return res.render("itemPage", { user, item, searchResult, searchField: filteredResultStr });
 else return res.render("itemPage", { item, searchResult, searchField: filteredResultStr });
});

function getUpperCase(string) {
 if (typeof string !== "string") return "";
 return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;
