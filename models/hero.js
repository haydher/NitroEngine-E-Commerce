const mongoose = require("mongoose");
const Joi = require("joi");

const Hero = mongoose.model("Hero", new mongoose.Schema({
 itemId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Items",
  required: true,
 },
 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Users",
 },
 title: {
  type: String,
  required: true,
  lowerCase: true,
  minLength: 5,
  maxLength: 30,
 },
 heroCover: {
  type: String,
  required: true,
 },
 heroImage: {
  type: String,
  required: true,
 },
 description: {
  type: String,
  required: true,
 },
 category: {
  type: String,
  required: true,
 },
 date: { type: Date, default: Date.now },
}));

function validateHero(params) {
 const schema = Joi.object({
  itemId: Joi.string().required(),
  title: Joi.string().min(5).max(30).required(),
  description: Joi.string().required(),
  author: Joi.string(),
  category: Joi.string(),
  heroCover: Joi.string().required(),
  heroImage: Joi.string().required(),
 });
 return schema.validate(params);
}

module.exports.Hero = Hero;
module.exports.validateHero = validateHero;
