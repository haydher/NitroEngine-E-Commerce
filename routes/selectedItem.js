const { User } = require("../models/user");
const { Item } = require("../models/item");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const getUserId = require("../middleware/getUserId");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();

// router.use(express.urlencoded({ extended: true }));
// // used for router.delete to override the post method

// passport.use(
//  new LocalStrategy(function (username, password, done) {
//   User.findOne({ username: username }, function (err, user) {
//    if (err) {
//     console.log("error", err);
//     return done(err);
//    }
//    if (!user) {
//     return done(null, false, { message: "No User with that username exists" });
//    }
//    if (!user.verifyPassword(password)) {
//     return done(null, false, { message: "Password is incorrect" });
//    }
//    name = user.username;
//    return done(null, user);
//   });
//  })
// );
// //  saves the use session
// passport.serializeUser(function (user, done) {
//  done(null, user.id);
// });
// //  unsaves the user session
// passport.deserializeUser(function (id, done) {
//  User.findById(id, function (err, user) {
//   done(err, user);
//  });
// });


router.get("/", getUserId, async (req, res) => {
 return res.status(400).send("Couldn't reach this link")
});

router.get("/:id", getUserId, async (req, res) => {
 
 const selectedItemWithId = await Item.findById(req.params.id)
 if (!selectedItemWithId) return res.status(400).send('Invalid ID.');

 const catalog = await Item.find()
 if (!catalog) return res.status(400).send('Invalid ID.');

 const user = await User.findById(req.userId).select("-password");

 if (user != undefined && selectedItemWithId != undefined) return res.render("selectedItem", { user, selectedItemWithId, catalog });
 else if ( selectedItemWithId == undefined) return res.status(404).send("Page not found")
 res.render("selectedItem", {selectedItemWithId, catalog})
});

module.exports = router;
