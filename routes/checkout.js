const { User } = require("../models/user");
const { Item } = require("../models/item");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", [authToken], async (req, res) => {
 res.render("checkout")
});

module.exports = router;
