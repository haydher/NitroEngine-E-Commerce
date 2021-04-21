const passport = require("passport");
const session = require("express-session");

module.exports = function (req, res, next) {
 try {
  if(req.session.passport != undefined){
   req.userId = req.session.passport.user;
   next();
  } else {
   req.userId = undefined
   next();
  }
 } catch (error) {
  console.log("GET ID ERROR LINE 19", error)
 }

};
