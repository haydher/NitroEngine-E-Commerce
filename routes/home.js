const { User } = require("../models/user");
const { Item } = require("../models/item");
const { Hero } = require("../models/hero");
const { Collection } = require("../models/collection");
const {authToken} = require("../middleware/authToken");
const express = require("express");
const router = express.Router();

router.get("/",authToken, async (req, res) => {
 // console.log("ID", req.userId)
 let user = await User.findById(req.userId)
 if(user?.length < 1 || !user || user == null) user = undefined

 let heroResult = await Hero.find()
 if (!heroResult || heroResult.length < 1) return res.status(500).send('Hero couldnt be found.');
 
 let collectionResult = await Collection.find()
 if (!collectionResult) return res.status(500).send('Hero couldnt be found.');

 let item = await Item.find()
 if (!item) return res.status(500).send('Invalid Search.');

 let itemInCart = user?.userCart[0]?.itemId.includes(req.params.id)
 if(itemInCart == undefined) itemInCart = false

 if (user != undefined && item.length > 0 &&  heroResult.length > 0 &&  collectionResult.length > 0){
  return res.render("index", { user, item, heroResult, collectionResult, itemInCart });
 }
 
 else if (item == undefined || item.length < 1 || 
  heroResult == undefined || heroResult.length < 1|| 
  collectionResult == undefined || collectionResult.length < 1) return res.status(404).render("404")

 res.render("index", {item, heroResult,collectionResult})
});

module.exports = router;
