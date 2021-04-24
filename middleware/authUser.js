// check if user is logged in
function reqLoginTrue(req, res, next) {
 if (req.userId != undefined) return next();
 return res.render("login");
}

// check if user is not logged in
function reqLoginFalse(req, res, next) {
 console.log("userId", req.userId)
 if (req.userId != undefined) return res.redirect("/");
 next();
}
module.exports.reqLoginTrue = reqLoginTrue;
module.exports.reqLoginFalse = reqLoginFalse;
