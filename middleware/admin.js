const { User } = require("../models/user");

module.exports = async function (req, res, next) {
 let user = await User.findById(req.userId).select("isAdmin")
 if (!user?.isAdmin) return res.status(403).send("Access denied");
 next();
};
