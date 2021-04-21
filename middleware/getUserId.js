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
  console.log("Got error getting getUserId on LINE 19 in getUserID.js", error)
 }
};
