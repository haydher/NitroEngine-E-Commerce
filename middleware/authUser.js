// check if user is logged in
function reqLoginTrue(req, res, next) {
 if (req.userId != undefined) return next();
 fullURL = req.header('Referer') || '/';
 let urlArr = fullURL.split("/")
 let urlPath = urlArr[urlArr.length - 1]
 if(urlPath == "cart") return res.render("login", {urlPath : "checkout"});
 return res.render("login", {urlPath});
}

// check if user is not logged in
function reqLoginFalse(req, res, next) {
 if (req.userId != undefined) return res.redirect("/");
 next();
}
module.exports.reqLoginTrue = reqLoginTrue;
module.exports.reqLoginFalse = reqLoginFalse;
