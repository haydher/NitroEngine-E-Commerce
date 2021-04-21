const mongoose = require("mongoose");
const Joi = require("joi");

const Collection = mongoose.model("Collection", new mongoose.Schema({
 title: {
  type: String,
  required: true,
  lowerCase: true,
  minLength: 5,
  maxLength: 30,
 },
 category: {
  type: String,
  required: true,
 },
 collectionImg: {
  type: String,
  required: true,
 },
 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Users",
 },
 date: { type: Date, default: Date.now },
}));

function validateCollection(params) {
 const schema = Joi.object({
  title: Joi.string().min(5).max(30).required(),
  category: Joi.string(),
  author: Joi.string(),
  collectionImg: Joi.string().required(),
 });
 return schema.validate(params);
}

module.exports.Collection = Collection;
module.exports.validateCollection = validateCollection;
