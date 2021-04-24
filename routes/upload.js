const { User } = require("../models/user");
const { Item, validateItem } = require("../models/item");
const { Hero, validateHero } = require("../models/hero");
const { Collection, validateCollection } = require("../models/collection");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const fileStorage = require("../middleware/uploadFile");
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: fileStorage });

router.get("/item", [authToken, reqLoginTrue, admin], async (req, res) => {
 res.render("uploadItem");
});

router.post("/item", [authToken, reqLoginTrue, admin ], upload.array("images", 10), async (req, res) => {
 const imgPath = path.join(__dirname + "/../public/imgUploads/" + req.body.category);

 const validate = validateItem({
  price: req.body.price,
  name: req.body.name,
  description: req.body.description,
  type: req.body.type,
  brand: req.body.brand,
  category: req.body.category,
  gender: req.body.gender,
  tags: req.body.tags,
  sizes: req.body.sizes,
  images: req.files,
 });

 if (validate.error) {
  // if input is not valid then find the path the image was stored in, and delete it
  deleteFile(imgPath, req.files);
  return res.status(400).render("uploadItem", { message: validate.error.details[0].message, data: req.body });
 }
 let item = await Item.find({ name: req.body.name });

 if (item.length > 0 && item) return res.status(400).send("Item with that name already exists");

 item = new Item({
  price: req.body.price,
  name: req.body.name,
  description: req.body.description,
  type: req.body.type,
  brand: req.body.brand,
  category: req.body.category,
  gender: req.body.gender,
  tags: req.body.tags,
  sizes: req.body.sizes,
  images: changeFileToArray(req.body.category, req.files),
  author: req.userId,
 });

 item = await item.save();
 res.render("uploadItem", { message: "File Uploaded Successfully" });
});

router.get("/hero", [authToken, reqLoginTrue, admin], async (req, res) => {
 res.render("uploadHero", {id: req.query.id});
});

router.post("/hero", 
[authToken, reqLoginTrue, admin],  
upload.fields([{name: 'heroCoverImg'},{name: 'heroItemImg'}]),
async (req, res) => {
 let heroCoverImg,heroItemImg
 console.log("req.files",req.files)
 if(req.files.heroCoverImg != undefined && req.files.heroItemImg != undefined) {
  heroCoverImg = req.files?.heroCoverImg[0].originalname
  heroItemImg = req.files?.heroItemImg[0].originalname
 }

 const validate = validateHero({
  itemId: req.body.itemId,
  title: req.body.title,
  description: req.body.description,
  category: req.body.category,
  author: req.userId,
  heroCover: heroCoverImg,
  heroImage: heroItemImg,
 });

 if (validate.error) {
  // deleteFile(imgPath, req.files);
  return res.status(400).render("uploadHero", { message: validate.error.details[0].message, data: req.body, id: req.body.itemId });
 }
 let hero = await Hero.find({itemId: req.body.itemId});
 console.log("HERO__", hero)
 if (hero != null && hero.length > 0 && hero)
  return res.status(400).render("uploadHero", 
  { message:"Hero for this item already exists", data: req.body, id: req.body.itemId });

 hero = new Hero({
  itemId: req.body.itemId,
  title: req.body.title,
  description: req.body.description,
  category: req.body.category,
  author: req.userId,
  heroCover: heroCoverImg,
  heroImage: heroItemImg,
 });
 hero = await hero.save();
 res.render("catalog", { message: "File to Hero Uploaded Successfully", });
});


router.get("/collection", [authToken, reqLoginTrue, admin], async (req, res) => {
 res.render("uploadCollections");
});

router.post("/collection", 
[authToken, reqLoginTrue, admin],  
upload.fields([{name: 'collectionImg'}]),
async (req, res) => {

 let collectionImg
 if(req.files.collectionImg != undefined)  collectionImg = req.files?.collectionImg[0].originalname

 const validate = validateCollection({
  title: req.body.title,
  category: req.body.category,
  author: req.userId,
  collectionImg: collectionImg,
 });

 if (validate.error)
  return res.status(400).render("uploadCollections", { message: validate.error.details[0].message, data: req.body});

 let collection = await Collection.find({category: req.body.category});
 console.log("collection__", collection)
 if (collection != null && collection.length > 0 && collection)
  return res.status(400).render("uploadCollections", {message:"Collection for this item already exists", data: req.body});

 collection = new Collection({
  title: req.body.title,
  category: req.body.category,
  author: req.userId,
  collectionImg: collectionImg,
 });
 console.log(collection)
 collection = await collection.save();
 res.render("uploadCollections", { message: "File to Collections Uploaded Successfully"});
});

function changeFileToArray(category, img) {
 let returnArr = [];
 img.forEach((element) => {
  let imgPath = `/${category}/${element.filename}`;
  returnArr.push(imgPath);
 });
 return returnArr;
}

function deleteFile(path, file) {
 let img;
 file.forEach((element) => {
  img = `${path}\\${element.originalname}`;
  fs.unlink(img, (err) => {
   if (err) throw err;
  });
 });
}

module.exports = router;
