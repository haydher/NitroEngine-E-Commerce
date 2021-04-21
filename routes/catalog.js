const { Catalog, validateInput } = require("../models/catalog");
const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();
// parses the url and changes it to key value. so key=value and fill up the post req
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
 // if (catalog[0].type != undefined) console.log(catalog[0].type);
 const catalog = await Catalog.find();
 res.send(catalog);
});

router.post("/", async (req, res) => {
 let newObj = new Catalog(req.body);

 const correctData = validateInput(req.body);
 if (correctData.error != undefined) return res.status(400).send(correctData.error.details[0].message);

 // looks for duplicates
 // if (catalog.length > 0) {
 //  if (catalog[0].type != undefined) {
 //   for (i = 0; i < catalog.length; i++) {
 //    if (catalog[i].type == newType) return res.status(400).send(`type of ${newType} already exists`);
 //   }
 //  }
 // }

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

 // let catalog = await Catalog.findByIdAndUpdate(paramID, { $set: req.body }, { new: true });
 // console.log("cataloggggggggg", catalog);
 // if (!catalog) return res.status(400).send(`No item with the ID of ${req.params.id} exists`);
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

/*

const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const catalog = [];

// holds the info about how the database should look like

const Catalog = mongoose.model(
 "Catalog",
 new mongoose.Schema({
  // makes sure the user has the name
  name: {
   type: String,
   required: true,
   // this converts the string to lowercase
   lowerCase: true,
   // set the length of the string. (characters)
   minLength: 5,
   maxLength: 30,
  },
  category: {
   type: String,
   lowercase: true,
  },
  tags: {
   type: Array,
   validate: {
    validator: function (v) {
     return v && v.length > 0;
    },
    message: "Tags should have at least one value",
   },
  },
  date: { type: Date, default: Date.now },
  price: {
   type: Number,
   min: 10,
   max: 200,
   required: true,
  },
 })
);

router.get("/", async (req, res) => {
 // if (catalog[0].type != undefined) console.log(catalog[0].type);
 const catalog = await Catalog.find();
 res.send(catalog);
});

router.post("/", (req, res) => {
 const newType = `${req.body.type}`.toLowerCase();

 const result = validateInput({ type: req.body.type });

 // if error doesnt equal undefined or means there is an error then abort and show message
 if (result.error != undefined) return res.status(400).send(result.error.details[0].message);

 // looks for duplicates
 if (catalog.length > 0) {
  if (catalog[0].type != undefined) {
   for (i = 0; i < catalog.length; i++) {
    if (catalog[i].type == newType) return res.status(400).send(`type of ${newType} already exists`);
   }
  }
 }

 const newObj = {
  type: newType,
  [newType]: [],
 };
 // push it in the obj
 catalog.push(newObj);
 // show the user the result
 res.send(catalog);
});

// make new content for the type
router.get("/:type/", (req, res) => {
 const params = `${req.params.type}`.toLowerCase();
 const type = catalog[0][params];
 res.send(type);
});

router.post("/:type/", (req, res) => {
 // gets the type from url
 const params = `${req.params.type}`.toLowerCase();
 const type = catalog[0][params];

 // make new obj in the specified type
 const itemDetail = {
  id: type.length + 1,
  price: req.body.price,
  name: req.body.name,
  gender: req.body.gender,
  description: req.body.description,
  gender: req.body.gender,
  image: [],
 };

 const correctData = checkTypeData(itemDetail);
 if (correctData.error != undefined) return res.status(400).send(correctData.error.details[0].message);

 for (let i = 0; i < type.length; i++) {
  if (req.body.name == type[0].name) return res.status(400).send(`This name already exists for item : ${type[0].id}`);
  if (req.body.description == type[0].name)
   return res.status(400).send(`This description already exists for item : ${type[0].id}`);
 }

 type.push(itemDetail);
 res.send(catalog);
});

router.get("/:type/:id", (req, res) => {
 res.send(catalog);
});

// validate the input
function validateInput(course) {
 // get the type
 // console.log(Object.keys(course)[0]);

 const schema = Joi.object({
  [Object.keys(course)[0]]: Joi.string().min(3).required(),
 });
 return schema.validate(course);
}

function checkTypeData(params) {
 const schema = Joi.object({
  id: Joi.number().positive(),
  price: Joi.number().positive().precision(2).required(),
  name: Joi.string().min(5).max(28).required(),
  gender: Joi.string().min(4).required(),
  description: Joi.string().required(),
  image: Joi.array(),
  // image: Joi.array().min(3).unique(),
 });
 return schema.validate(params);
}

module.exports = router;


*/
