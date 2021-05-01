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
  fullURL = req.header('Referer') || '/';
  let urlArr = fullURL.split("/")
  let urlPath = urlArr[urlArr.length - 1]
  res.render("register", {urlPath});
//  res.render("register");
}); 
// post data to sign up page
router.post("/register", [authToken, reqLoginFalse], async (req, res) => {
 const validate = validateUser(req.body);
 if (validate.error) return res.status(400).render("register", {messages: validate.error.details[0].message.error});

 let user = await User.find({
  $or: [{ username: req.body.username }, { email: req.body.email }, { phone: req.body.phone }],
 });
 if (user.length > 0) return res.status(400).render("register",{ messages: "User already exists"});

 user = new User(req.body);
 // this generates a key value of 10 digits to decrypt the password after
 const salt = await bcrypt.genSalt(10);
 // this makes the password hashed so its not stored as a plain text
 user.password = await bcrypt.hash(user.password, salt);

 user = await user.save();
 
 let token = user.generateAuthToken()

//  res.cookie('token', token).redirect("/");
 res.cookie('token', token).redirect(`/${req.query.path}`);
});

// get to the login page
router.get("/login",  [authToken, reqLoginFalse], async (req, res) => {
 //send user back to where they logged in from
 fullURL = req.header('Referer') || '/';
 let urlArr = fullURL.split("/")
 let urlPath = urlArr[urlArr.length - 1]
 res.render("login", {urlPath});
});

router.post("/login", async (req, res) => {
  const validate = validateLogin(req.body);
  if (validate.error) return res.status(400).send(validate.error.details[0].message);

  let user = await User.find({ username: req.body.username });
  if (user.length < 1 || user == undefined) return res.status(400).render("login", { messages: "No User with that Username exists."});

  let password = user[0]?.verifyPassword(req.body.password)
  if(!password) return res.status(400).render("login", { messages: "Invalid Password"});

  let token = user[0].generateAuthToken()
  console.log("req.query.path", req.query)
  // res.cookie('token', token).redirect("/");
  res.cookie('token', token).redirect(`/${req.query.path}`);
});

// logout the session
router.post("/logout", [authToken, reqLoginTrue], (req, res) => {
 res.cookie("token", "", {expire: Date.now()}).redirect("/");
});

router.get("/edit",[authToken, reqLoginTrue], async (req, res)=> {
  let user = await User.findById(req.userId).select("-password")
  if(user.length < 1 || !user || user == undefined) return res.render(404)
  
  res.render("accountEdit", {user})
})

router.put("/edit",[authToken, reqLoginTrue], async (req, res)=> {
  console.log("req.body", req.body)
  let user = await User.findById(req.userId)
  if(user.length < 1 || user == undefined || !user) user = undefined

  let userDup = await User.find({username: req.body.username })
  if(userDup.length > 0 && userDup != undefined && userDup[0].username == user.username)
    console.log("same user with same username, ignore the message", userDup[0].username, user.username)
  else if(userDup.length > 0 && userDup != undefined && userDup[0].username != user.username)
   return res.send({ status: 500, message: "Username already taken"})

  userDup = await User.find({email: req.body.email })
  if(userDup.length > 0 && userDup != undefined && userDup[0].email == user.email)
    console.log("same user with same email, ignore the message", userDup[0].email, user.email)
  else if(userDup.length > 0 && userDup != undefined && userDup[0].email != user.email)
   return res.send({ status: 500,message: "User with that Email already exists"})

  userDup = await User.find({phone: parseInt(req.body.phone) })
  if(userDup.length > 0 && userDup != undefined && userDup[0].phone == user.phone)
    console.log("same user with same phone, ignore the message", userDup[0].phone, user.phone)
  else if(userDup.length > 0 && userDup != undefined && userDup[0].phone != user.phone)
   return res.send({ status: 500, message: "User with that Phone Number already exists"})

  console.log("something wasnt the same, and no dups were found. Should update account")
  if(user.username != req.body.user ||
    user.email != req.body.email || 
    user.phone != req.body.phone){
      user = await User.updateOne({"_id": req.userId}, 
        {
          $set: {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "username": req.body.username,
            "email": req.body.email,
            "phone": req.body.phone,
          },
        },
        { useUnifiedTopology: true, returnOriginal: false}
      )
    console.log("account updated successfully")
    return res.send({status: 200, message: "Account Updated Successfully"})
  
  } else return res.send({status: 304, message: "No changes made."})
})

router.get("/changePassword", [authToken, reqLoginTrue], async (req, res) => {
  let user = await User.findById(req.userId)
  if(!user || user.length < 1) user = undefined
  res.render("changePass", {user});
});

router.put("/changePassword", [authToken, reqLoginTrue], async (req, res) => {

 console.log("req.body", req.body);

 let user = await User.findById(req.userId)
 if(!user || user == undefined || user.length < 1) return res.send({status: 400, message: "User not found."})

 let verifyPass = user.verifyPassword(req.body.currPass)
 console.log("verify password", verifyPass)
 
 if(verifyPass == false) return res.send({status: 500, message: "Current Password is not correct"})
 
 if(req.body.currPass === req.body.newPass) return res.send({status: 500, message: "New Password can not be same as old password"})
 if(req.body.newPass != req.body.confPass) return res.send({status: 500, message: "Passwords did not match."})

 const salt = await bcrypt.genSalt(10);
 let newPassword = await bcrypt.hash(req.body.newPass, salt);
 console.log("newPassword", newPassword);

  await User.findByIdAndUpdate(req.userId,
    {
      password: newPassword,
    },
    { new: true }
 );
 console.log("Password updated");

  res.send({status: 200, message: "Password Changed Successfully."})
});

module.exports = router;