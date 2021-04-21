const { User, validateUser } = require("../models/user");
const { reqLoginTrue, reqLoginFalse } = require("../middleware/authUser");
const express = require("express");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const mongoose = require("mongoose");
const router = express.Router();
const env = require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const methodOverride = require("method-override");
const LocalStrategy = require("passport-local").Strategy;

router.use(express.urlencoded({ extended: true }));
// used for router.delete to override the post method
router.use(methodOverride("_method"));

passport.use(
 new LocalStrategy(function (username, password, done) {
  User.findOne({ username: username }, function (err, user) {
   if (err) {
    console.log("error in passport, (auth.js line 24)", err);
    return done(err);
   }
   if (!user) {
    return done(null, false, { message: "No User with that username exists" });
   }
   if (!user.verifyPassword(password)) {
    return done(null, false, { message: "Password is incorrect" });
   }
   name = user.username;
   return done(null, user);
  });
 })
);
//  saves the use session
passport.serializeUser(function (user, done) {
 done(null, user.id);
});
//  unsaves the user session
passport.deserializeUser(function (id, done) {
 User.findById(id, function (err, user) {
  done(err, user);
 });
});
// initialize the flash to show error messages
router.use(flash());
// initialize session
router.use(
 session({
  secret: process.env.SECRET_SESSION_TOKEN,
  resave: false,
  saveUninitialized: false,
  // store: MongoStore.create({mongoUrl: process.env.DB}),
 })
);
router.use(passport.initialize());
router.use(passport.session());

router.get("/", reqLoginTrue, async (req, res) => {
 res.render("account")
})

// show the signup page
router.get("/register", reqLoginFalse, async (req, res) => {
 res.render("register");
});
// post data to sign up page
router.post("/register", reqLoginFalse, async (req, res) => {
 console.log("in register");
 const validate = validateUser(req.body);
 if (validate.error) return res.status(400).send(validate.error.details[0].message);

 let user = await User.find({
  $or: [{ username: req.body.username }, { email: req.body.email }, { phone: req.body.phone }],
 });
 if (user.length > 0) return res.status(400).send("User already exists");

 user = new User(req.body);
 // this generates a key value of 10 digits to decrypt the password after
 const salt = await bcrypt.genSalt(10);
 // this makes the password hashed so its not stored as a plain text
 user.password = await bcrypt.hash(user.password, salt);

 user = await user.save();
 res.redirect("/");
 // res.send("User signed up successfully");
});

// get to the login page
router.get("/login", reqLoginFalse, async (req, res) => {
 res.render("login");
});

router.post(
 "/login",
 passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/account/login",
  failureFlash: true,
 }),
 (req, res) => {
  res.rendredirecter("/");
 }
);

router.get("/changepassword", reqLoginTrue, async (req, res) => {
 res.render("changePass");
});

router.post("/changepassword", reqLoginTrue, async (req, res) => {
 let userId;
 try {
  if (req.session.passport != undefined) {
   console.log("req.session.passport.user - login", req.session.passport.user);
   userId = req.session.passport.user;
  }
 } catch (error) {
  console.log("ERROR: ", error);
 }

 console.log("req.body.password", req.body.password);

 const salt = await bcrypt.genSalt(10);
 // this makes the password hashed so its not stored as a plain text
 let newPassword = await bcrypt.hash(req.body.password, salt);
 console.log("newPassword", newPassword);

 const user = await User.findByIdAndUpdate(
  userId,
  {
   password: newPassword,
  },
  { new: true }
 );

 if (!user) return res.status(404).send("The user with the given ID was not found.");
 console.log("Password updated");
 console.log(user);

 // res.render("changePass");
 res.send("Password updated");
});

// logout the session
router.delete("/logout", reqLoginTrue, (req, res) => {
 req.logOut();
 res.redirect("/");
});

module.exports = router;
