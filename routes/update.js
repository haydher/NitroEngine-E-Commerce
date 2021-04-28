const { User } = require("../models/user");
const { Item, validateItem } = require("../models/item");
const { Hero, validateHero } = require("../models/hero");
const { Collection, validateCollection } = require("../models/collection");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const fileStorage = require("../middleware/uploadFile");
const {uploadFile, deleteImg} = require("./s3")
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: fileStorage });

router.put("/item/:param", [authToken, reqLoginTrue, admin ], upload.array("images", 10), async (req, res) => {

 console.log("req.body", req.body)
 console.log("req.params", req.params)
 let item
 if(req.params == "update"){
  item = await Item.updateOne({ _id: req.body.itemId }, 
   { $set: { 
    price: req.body.price,
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    brand: req.body.brand,
    category: req.body.category,
    gender: req.body.gender,
    tags: req.body.tags,
    sizes: req.body.sizes,
   }})
  console.log("item updated", item)
 }
 if(req.params == "delete"){
  item = await Item.findByIdAndDelete({_id: req.body.itemId})
  console.log("Item deleted", item)
 }

 res.json(item)
});

router.get("/hero", [authToken, reqLoginTrue, admin], async (req, res) => {
 let user = await User.findById(req.userId).select("-password -email -phone")
 if(!user || user.length < 1) user = undefined
 res.render("uploadHero", { user, id: req.query.id});
});

router.post("/hero", 
[authToken, reqLoginTrue, admin],  
upload.fields([{name: 'heroCoverImg'},{name: 'heroItemImg'}]),
async (req, res) => {
 let heroCoverImg,heroItemImg
 const imgPath = path.join(__dirname + "/../public/images");
 
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
 // upload image to aws s3
 let promises = [];
 promises.push(uploadFile(req.files?.heroCoverImg[0]));
 promises.push(uploadFile(req.files?.heroItemImg[0]));
 Promise.all(promises).then((data)=>{
  deleteFile(imgPath, req.files?.heroCoverImg)
  deleteFile(imgPath, req.files?.heroItemImg)
  return res.redirect("../item/catalog");
 }).catch((err)=>{
  return res.render("uploadHero", { message: "Error Uploading file to AWS S3", });
 }) 

 // res.render("catalog", { message: "File to Hero Uploaded Successfully", });
});

router.get("/collection", [authToken, reqLoginTrue, admin], async (req, res) => {
 let user = await User.findById(req.userId).select("-password -email -phone")
 if(!user || user.length < 1) user = undefined
 res.render("uploadCollections", { user});
});

router.post("/collection", 
[authToken, reqLoginTrue, admin],  
upload.fields([{name: 'collectionImg'}]),
async (req, res) => {

 const imgPath = path.join(__dirname + "/../public/images");

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
 
 collection = await collection.save();
 // upload image to aws s3
 let promises = [];
 for(let i = 0; i < req.files.collectionImg.length; i++){
  let file = req.files.collectionImg[i];
  promises.push(uploadFile(file));
 }
 Promise.all(promises).then((data)=>{
  deleteFile(imgPath, req.files.collectionImg)
  return res.render("uploadCollections", { message: "File to Collections Uploaded Successfully"});
 }).catch((err)=>{
  return res.send(err.stack);
 }) 

 // res.render("uploadCollections", { message: "File to Collections Uploaded Successfully"});
});

function changeFileToArray(img) {
 let returnArr = [];
 img.forEach((element) => {
  returnArr.push(element.filename);
 });
 return returnArr;
}

function deleteFile(path, file) {
 let img;
 for(let i = 0; i < file.length; i++){
  img = `${path}\\${file[i].originalname}`;
  fs.unlink(img, (err) => {
   if (err) throw err;
  });
 }
}

module.exports = router;
