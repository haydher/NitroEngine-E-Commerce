const passport = require("passport");
const session = require("express-session");

console.log("In getUserId")
console.log("Getting getUserId")

module.exports = function (req, res, next) {
 console.log("Getting getUserId function")
 try {
  let getPassportLength = Object.keys(req.session.passport).length
  if(req.session.passport != undefined && getPassportLength > 0){
   req.userId = req.session.passport.user;
   console.log("checking req.session", req.session) 
   console.log("checking req.session.passport", req.session.passport)
   console.log("checking length of req.session.passport", Object.keys(req.session.passport).length)
   console.log("Successfully got the req.userId", req.userId)
   next();
  } else {
   req.userId = undefined
   console.log("could not get the getUserId function")
   console.log("Req.userId is undefined", req.userId)
   next();
  }
 } catch (error) {
  console.log("Got error getting getUserId on LINE 19 in getUserID.js", error)
 }
 console.log("Existing try catch block")
};
