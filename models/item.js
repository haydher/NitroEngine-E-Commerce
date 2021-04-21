const mongoose = require("mongoose");
const Joi = require("joi");

const ItemSchema = new mongoose.Schema({
 price: {
  type: Number,
  min: 1,
  required: true,
 },
 name: {
  type: String,
  required: true,
  lowerCase: true,
  minLength: 5,
  maxLength: 30,
  index: true
 },
 description: {
  type: String,
  required: true,
 },
 type: {
  type: String,
  required: true,
  lowerCase: true,
  index: true
 },
 brand: {
  type: String,
  required: true,
  lowerCase: true,
  index: true
 },
 category: {
  type: String,
  lowercase: true,
  required: true,
  index: true
 },
 gender: {
  type: String,
  minLength: 3,
  required: true,
  lowerCase: true,
  index: true
 },
 tags: {
  type: String,
  required: true,
  lowerCase: true,
  index: true
 },
 sizes: {
  type: String,
  required: true,
  lowerCase: true,
 },
 date: { type: Date, default: Date.now },
 images: {
  type: Array,
  validate: {
   validator: function (v) {
    return v && v.length > 2;
   },
   message: "Should have at least 3 images",
  },
 },
 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Users",
 },
})
ItemSchema.index(
 {name: "text",
 type: "text",
 brand: "text",
 category: "text",
 gender: "text",
 tags: "text"});
const Item = mongoose.model("Items", ItemSchema);

function validateItem(params) {
 const schema = Joi.object({
  // price: Joi.number().positive().precision(2).required(),
  price: Joi.string().required(),
  name: Joi.string().min(5).max(30).required(),
  description: Joi.string().min(10).required(),
  type: Joi.string().min(4).required(),
  brand: Joi.string().required(),
  category: Joi.string().required(),
  gender: Joi.string().min(3).required(),
  tags: Joi.string().required(),
  sizes: Joi.string().required(),
  images: Joi.array().min(3).unique().required(),
  author: Joi.string(),
 });
 return schema.validate(params);
}

module.exports.Item = Item;
module.exports.validateItem = validateItem;
