const { User } = require("../models/user");
const { Item } = require("../models/item");
const { Cart, validateCart } = require("../models/cart");
const { authToken } = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();

router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.get("/", [authToken], async (req, res) => {
 console.log("in cart");
 let user = await User.findById(req.userId).select("-password");
 if (user == undefined) user = undefined;
 // if user is logged in then add items to user's cart
 if (user) {
  console.log("User is logged in", user);
  let readCookie = req.cookies.cart?.split(",");
  let userItemArr = [],
   userItemSizeArr = [];
  // if cookie has a cart with items
  if (readCookie && readCookie[0].length > 0) {
   for (let i = 0; i < readCookie.length; i++) {
    let cookieItem = readCookie[i].split("+");
    // check if user cart already has item
    if (user.userCart.length > 0) {
     let dupTrue = user.userCart[0].itemId.includes(cookieItem[0]);
     // if the item from cookie doest exist in user cart then add it
     if (!dupTrue) {
      user.userCart[0].itemId.push(cookieItem[0]);
      user.userCart[0].size.push(cookieItem[1]);
      await user.save();
     }
    } else {
     // otherwise if cart is empty then add the cookie item in user cart
     userItemArr.push(cookieItem[0]);
     userItemSizeArr.push(cookieItem[1]);
    }
   }
   // if user has no item in cart then make a new cart obj and add the items
   if (user.userCart.length < 1) {
    await User.updateMany(
     { _id: req.userId },
     {
      $set: {
       userCart: new Cart({
        userId: user._id,
        itemId: userItemArr,
        size: userItemSizeArr,
       }),
      },
     },
     { useUnifiedTopology: true }
    );
   }
  }
  let userCartItem = [];
  let cartLength = user.userCart[0]?.itemId;
  for (let i = 0; i < cartLength?.length; i++) {
   let item = await Item.findById(cartLength[i]);
   if (item != undefined) userCartItem.push(item);
  }
  // let item = await Item.findById
  if (user != undefined && userCartItem.length > 0)
   return res.clearCookie("cart").render("cart", {
    user,
    itemArr: userCartItem,
    itemSize: user.userCart[0].size,
   });
 }
 let itemArr = [];
 let itemSize = [];

 let readCookie = req.cookies.cart?.split(",");
 const emptyIndex = readCookie?.indexOf("");
 if (emptyIndex > -1 && emptyIndex != undefined) {
  readCookie.splice(emptyIndex, 1);
 }

 if (readCookie && readCookie != "") {
  for (let i = 0; i < readCookie.length; i++) {
   let cookieItem = readCookie[i].split("+");
   console.log("cookieItem", cookieItem);

   let item = await Item.findById(cookieItem[0]);
   if (!item || item.length < 1) return res.status(404).send("item not found");
   itemArr.push(item);
   itemSize.push(cookieItem[1]);
  }
  if (user != undefined && itemArr.length > 0 && itemSize.length > 0) {
   return res.render("cart", { user, itemArr, itemSize });
  }
  return res.render("cart", { itemArr, itemSize });
 } else if (user != undefined) return res.render("cart", { user });
 else return res.render("cart");
});

// update user cart without adding cookie if user is logged in
router.post("/", [authToken], async (req, res) => {
 let prevCookie;
 if (req.userId != undefined) {
  let user = await User.findById(req.userId).select("-password");
  if (!user || user == undefined) return res.end();

  let cookies = req.cookies.cart?.split(",");
  let cartItemId = [],
   cartItemSize = [];

  if (cookies != undefined) {
   let tempCookie;
   for (let i = 0; i < cookies.length; i++) {
    if (!cookies[i].split("+")[0].includes(`${req.body.itemId}`))
     tempCookie = `${cookies},${req.body.itemId}+${req.body.itemSize}`;
   }
   cookies = tempCookie.split(",");
   for (let i = 0; i < cookies.length; i++) {
    if (!user.userCart[0]?.itemId.includes(cookies[i].split("+")[0])) {
     cartItemId.push(cookies[i].split("+")[0]);
     cartItemSize.push(cookies[i].split("+")[1]);
    }
   }
  }
  // if user has no item in cart then make a new cart obj and add the items
  if (user.userCart.length < 1) {
   if (cookies == undefined) {
    cartItemId.push(req.body.itemId);
    cartItemSize.push(req.body.itemSize);
   }
   await User.updateMany(
    { _id: req.userId },
    {
     $set: {
      userCart: new Cart({
       userId: user._id,
       itemId: cartItemId,
       size: cartItemSize,
      }),
     },
    },
    { useUnifiedTopology: true }
   );
  }
  // check if user cart already has item
  if (user.userCart.length > 0) {
   if (cookies != undefined) {
    cookies.forEach((cookie) => {
     if (!user.userCart[0].itemId.includes(cookie.split("+")[0])) {
      user.userCart[0].itemId.push(cookie.split("+")[0]);
      user.userCart[0].size.push(cookie.split("+")[1]);
     }
    });
   } else {
    if (!user.userCart[0].itemId.includes(req.body.itemId)) {
     user.userCart[0].itemId.push(req.body.itemId);
     user.userCart[0].size.push(req.body.itemSize);
    }
   }
   await user.save();
  }
  let userCartCount = await User.findById(req.userId).select("userCart");
  let cartCount = userCartCount.userCart[0].itemId.length;
  return res.json({ cartCount });
 }

 prevCookie = req.cookies.cart?.split(",");
 let currCookie = `${req.body.itemId}+${req.body.itemSize}`;
 let newCookie;
 // check if cookie already has item
 if (prevCookie != undefined) {
  let prevCookieId = [];
  // separate the id from the cookie
  prevCookie.forEach((element) => {
   prevCookieId.push(element.split("+")[0]);
  });
  // if the id exists in the cookie then dont add new cookie
  if (!prevCookieId.includes(`${req.body.itemId}`)) newCookie = `${prevCookie},${req.body.itemId}+${req.body.itemSize}`;
  // otherwise make a new cookie string
  else newCookie = req.cookies.cart;
 } else newCookie = currCookie;
 let cartCount = newCookie.split(",").length;
 // add the new cookie to data
 res.cookie("cart", newCookie).json({ cartCount });
});

module.exports = router;
