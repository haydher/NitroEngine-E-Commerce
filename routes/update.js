const { User } = require("../models/user");
const { Item, validateItem } = require("../models/item");
const { Hero, validateHero } = require("../models/hero");
const { Collection, validateCollection } = require("../models/collection");
const {authToken} = require("../middleware/authToken");
const { reqLoginTrue } = require("../middleware/authUser");
const admin = require("../middleware/admin");
const fileStorage = require("../middleware/uploadFile");
const {uploadFile, downloadImgFromS3, deleteImg} = require("./s3")
const express = require("express");
const ejs = require("ejs");
const router = express.Router();
const env = require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: fileStorage });

router.put("/item/:param", [authToken, reqLoginTrue, admin ], async (req, res) => {
 let item
 if(req.params.param == "update"){
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
   return res.send(item)
 }else if(req.params.param == "delete"){

  item = await Item.findById(req.body.itemId).select("images")
  if(!item || item.length < 1) return res.status(404)
  let itemImgArr = item.images
  
  item = await Item.findByIdAndDelete({_id: req.body.itemId})

  let promises = [];
  for(let i = 0; i < itemImgArr.length; i++){
   let file = itemImgArr[i];
   promises.push(deleteImg(file));
  }
  Promise.all(promises).then((data)=>{
   // deleteFile(imgPath, req.files)
   console.log("deleted all images from S3 while deleting the item")
  }).catch((err)=>{
   console.log("error deleting images from S3 while deleting the item", err)
  //  return res.send(err.stack);
  }) 
  return res.json(item)
 } else if(req.params.param == "deleteDup") {
  item = await Item.findByIdAndDelete({_id: req.body.itemId})
  if(!item || item == undefined || item.length < 1) return res.json({status: 500})
  return res.json(item)
 }else return res.status(500)
});

router.get("/:id", [authToken, reqLoginTrue, admin ], async (req, res) => {
 
 let user = await User.findById(req.userId).select("-password")
 if(!user || user.length < 1) return res.status(404).send("Admin not found to Access the page.")

 let item = await Item.findById(req.params.id)
 if(!item || item.length < 1) return res.status(404).send("Item not found")

 res.render("editItem", {user, item})
});

router.put("/image/:param?", [authToken, reqLoginTrue, admin ], upload.single("uploadImg"), async (req, res) => {

 let item
 if(req.params.param == "delete"){
   item = await Item.findById(req.body.itemId).select("images")
   if(!item || item.length < 1) return res.status(400)
  
   let imgArr = item.images
  
   const index = imgArr.indexOf(req.body.imgId);
   if (index > -1) {
    imgArr.splice(index, 1);
   }
   
   await Item.findByIdAndUpdate({_id: req.body.itemId}, 
   {$set: {
    "images": imgArr,
   }})
   
   try {
    await deleteImg(req.body.imgId)
    console.log("image delete successfully from S3")
   } catch (error) {
    console.log("Error Deleting image from S3", error)
   }
  res.json(item)
 }else if(req.params.param == "upload") {

  item = await Item.findById(req.query.id).select("images")
  if(!item || item.length < 1) return res.status(400)
 
  item.images.push(req.file.originalname)
 
  item.save().then(()=> {
   console.log("saved item")

   uploadFile(req.file).then(()=>{
    console.log("Image Uploaded Successfully");
    return res.send(item);
   }).catch((err)=>{
    console.log(err.stack)
    return res.send(item);
   }) 

  })
 }

});

module.exports = router;
