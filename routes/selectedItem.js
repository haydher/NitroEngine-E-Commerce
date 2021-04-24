const { User } = require("../models/user");
const { Item } = require("../models/item");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();

router.get("/", authToken, async (req, res) => {
 return res.status(400).send("Couldn't reach this link")
});

router.get("/:id", authToken, async (req, res) => {
 
 const selectedItemWithId = await Item.findById(req.params.id)
 if (!selectedItemWithId) return res.status(400).send('Invalid ID.');

 const catalog = await Item.find()
 if (!catalog) return res.status(400).send('Invalid ID.');

 const user = await User.findById(req.userId).select("-password");

 if (user != undefined && selectedItemWithId != undefined) return res.render("selectedItem", { user, selectedItemWithId, catalog });
 else if ( selectedItemWithId == undefined) return res.status(404).send("Page not found")
 res.render("selectedItem", {selectedItemWithId, catalog})
});

module.exports = router;
