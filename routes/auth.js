const { User, validateUser, validateLogin } = require("../models/user");
const { reqLoginTrue, reqLoginFalse } = require("../middleware/authUser");
const {authToken} = require("../middleware/authToken");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const mongoose = require("mongoose");
const router = express.Router();
const env = require("dotenv").config();

router.use(express.urlencoded({ extended: true }));
// used for router.delete to override the post method

router.get("/", [authToken, reqLoginTrue], async (req, res) => {
 let user = await User.findById(req.userId).select("-passport")
 if(!user || user == undefined || user.length < 1) return res.status(404).send("Account not found")
 res.render("account", {user})
})
// show the signup page
router.get("/register", [authToken, reqLoginFalse] , async (req, res) => {
 res.render("register");
});
// post data to sign up page
router.post("/register", [authToken, reqLoginFalse], async (req, res) => {
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
 
 let token = user.generateAuthToken()
 
 res.cookie('token', token).redirect("/");
});

// get to the login page
router.get("/login",  [authToken, reqLoginFalse], async (req, res) => {
 res.render("login");
});

router.post("/login", async (req, res) => {
  const validate = validateLogin(req.body);
  if (validate.error) return res.status(400).send(validate.error.details[0].message);

  let user = await User.find({ username: req.body.username });
  if (user.length < 0 || user == undefined) return res.status(400).send("Username doesnt exist");

  let password = user[0].verifyPassword(req.body.password)
  if(!password) return res.send("Invalid Password")

  let token = user[0].generateAuthToken()
 
  res.cookie('token', token).redirect("/");
});

router.get("/changepassword", [authToken, reqLoginTrue], async (req, res) => {
 res.render("changePass");
});

router.post("/changepassword", [authToken, reqLoginTrue], async (req, res) => {
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
router.post("/logout", [authToken, reqLoginTrue], (req, res) => {
 res.cookie("token", "", {expire: Date.now()}).redirect("/");
});

module.exports = router;