const passport = require("passport");
const session = require("express-session");

// check if user is logged in
function reqLoginTrue(req, res, next) {
 if (req.isAuthenticated()) return next();
 return res.render("login");
}

// check if user is not logged in
function reqLoginFalse(req, res, next) {
 if (req.isAuthenticated()) return res.redirect("/");
 next();
}
module.exports.reqLoginTrue = reqLoginTrue;
module.exports.reqLoginFalse = reqLoginFalse;
