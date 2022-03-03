const { User, PrevOrder } = require("../models/user");
const { Item } = require("../models/item");
const { authToken } = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const { func } = require("joi");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", [authToken, reqLoginTrue], async (req, res) => {
 fullURL = req.header("Referer") || "/";
 const urlArr = fullURL.split("/");
 const urlPath = urlArr[urlArr.length - 1];
 console.log("urlPath", urlPath);

 const user = await User.findById(req.userId);
 if (!user || user.length < 1) return redirect("/");

 const itemArr = [],
  itemSize = [];
 for (let i = 0; i < user.prevOrders.length; i++) {
  const itemId = user.prevOrders[i].itemId;
  const item = await Item.findById(itemId);
  if (!item || item?.length < 1) return res.redirect("/");
  itemArr.push(item);
  itemSize.push(user.prevOrders[i].size);
 }
 res.render("receipt", { user, itemArr, itemSize });
});

router.post("/", [authToken, reqLoginTrue], async (req, res) => {
 let user = await User.findById(req.userId).select("-password");
 if (user == undefined) return res.status(404).render("404");

 let itemArr = [];
 let itemArrId = user.userCart[0]?.itemId;
 let itemSize = user.userCart[0]?.size;

 for (let i = 0; i < itemArrId.length; i++) {
  let item = await Item.findById(itemArrId[i]);

  if (item != undefined || item?.length > 0) {
   itemArr.push(item);
   // if prev order is empty then add an item,
   if (user.prevOrders.length < 1) {
    await User.updateMany(
     { _id: req.userId },
     {
      $set: {
       prevOrders: [
        new PrevOrder({
         userId: user._id,
         itemId: item,
         size: itemSize[0],
        }),
       ],
      },
     },
     { useUnifiedTopology: true }
    );
   } else if (user.prevOrders.length > 0) {
    for (let j = 0; j < user.prevOrders.length; j++) {
     if (!user.prevOrders[j].itemId == item && !user.prevOrders[j].size == itemSize[i])
      user.prevOrders.push(
       new PrevOrder({
        userId: user._id,
        itemId: itemArrId[i],
        size: itemSize[i],
       })
      );
     else console.log("prevOrder already has items that exists in the cart");
    }
   }
  }
 }

 await User.updateMany(
  { _id: req.userId },
  {
   $set: {
    giftValue: updateGiftValue(itemArr, user.giftValue),
    userCart: [],
   },
  },
  { useUnifiedTopology: true }
 );
 try {
  console.log("saving the user model");
  await user.save();
  console.log("Successfully saved the user model");
 } catch (error) {
  console.log("Error saving model", error);
 }
 res.clearCookie("cart").redirect("/receipt");
});

function updateGiftValue(itemArr, giftValue) {
 let totalPrice = 0;
 itemArr.forEach((item) => {
  totalPrice += item.price;
 });
 return giftValue - totalPrice;
}

module.exports = router;
