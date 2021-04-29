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

 let user = await User.findById(req.userId).select("-password");
 if(user == undefined) return res.status(404).render("404")

 let itemArr = []
 let itemArrId =  user.userCart[0].itemId
 let itemSize = user.userCart[0].size
 for(let i = 0; i < itemArrId.length; i++){
  let item = await Item.findById(itemArrId[i])
  if(item != undefined) itemArr.push(item)
 }
 res.render("checkout", { user, itemArr, itemSize })
});

module.exports = router;
