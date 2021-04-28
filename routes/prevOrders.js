const { User } = require("../models/user");
const { Item } = require("../models/item");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", [authToken, reqLoginTrue], async (req, res) => {
 
 let user = await User.findById(req.userId).select("-password")
 if(!user || user.length < 1) return res.redirect("/")
 
 const itemArr = [], itemSize = [], orderDate = []
 for(let i = 0; i < user.prevOrders.length; i++){
  const itemId = user.prevOrders[i].itemId
  const item = await Item.findById(itemId)
  if(!item || item?.length < 1) return res.redirect("/")
  itemArr.push(item)
  itemSize.push(user.prevOrders[i].size)
  orderDate.push(user.prevOrders[i].date)
 }
 let catalogArr = await Item.find().limit(10);
 if(!catalogArr || catalogArr?.length < 1) catalogArr == undefined
 res.render("prevOrders", { user, itemArr, itemSize, orderDate, catalogArr })
});

module.exports = router;
