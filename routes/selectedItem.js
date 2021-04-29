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

 let itemInCart = user?.userCart[0]?.itemId.includes(req.params.id)
 if(itemInCart == undefined) itemInCart = false
 if (user != undefined && selectedItemWithId != undefined) return res.render("selectedItem", { user, selectedItemWithId, catalog, itemInCart });
 else if ( selectedItemWithId == undefined) return res.status(404).redner("404")
 res.render("selectedItem", {selectedItemWithId, catalog, itemInCart})
});

module.exports = router;
