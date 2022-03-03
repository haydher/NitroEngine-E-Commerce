const { Catalog, validateInput } = require("../models/catalog");
const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
 const catalog = await Catalog.find();
 res.send(catalog);
});

router.post("/", async (req, res) => {
 let newObj = new Catalog(req.body);

 const correctData = validateInput(req.body);
 if (correctData.error != undefined) return res.status(400).send(correctData.error.details[0].message);
 try {
  // this saves the data into the database
  newObj = await newObj.save();
  console.log(newObj);
  // show the user the result
  res.send(newObj);
 } catch (exception) {
  // show all errors
  for (Field in exception.errors) console.log("Error: ", exception.errors[Field].message);
 }
});

// get the category content for the type
router.get("/type", async (req, res) => {
 return res.status(400).send(`Please enter a valid type.`);
});

// get the category content for the type
router.get("/type/:type", async (req, res) => {
 const params = `${req.params.type}`.toLowerCase();

 let category = await Catalog.find({ category: params });
 if (category.length < 1) return res.status(400).send(`No item with type of ${params} exists`);

 res.send(category);
});

router.get("/id", async (req, res) => {
 return res.status(400).send(`Please enter a valid ID.`);
});

// get content by id
router.get("/id/:id", async (req, res) => {
 // const paramID = `${req.params.id}`;
 let contentID;
 try {
  contentID = await Catalog.findById(req.params.id);
 } catch (error) {
  console.log("ERROOOOR:", error);
  return res.status(400).send(`No item with the ID of ${req.params.id} exists`);
 }
 res.send(contentID);
});

router.put("/id/:id", async (req, res) => {
 const paramID = `${req.params.id}`;

 try {
  catalog = await Catalog.findByIdAndUpdate(paramID, { $set: req.body }, { new: true });
 } catch (error) {
  console.log("ERROOOOR:", error);
  return res.status(400).send(`No item with the ID of ${req.params.id} exists`);
 }

 const correctData = validateInput(req.body);
 if (correctData.error != undefined) return res.status(400).send(correctData.error.details[0].message);

 res.send(catalog);
});

router.delete("/id/:id", async (req, res) => {
 const deleteObj = await Catalog.findByIdAndRemove(req.params.id, { useFindAndModify: false });
 if (!deleteObj) return res.status(400).send(`No item with the ID of ${req.params.id} exists`);
 res.send(deleteObj);
});

module.exports = router;
