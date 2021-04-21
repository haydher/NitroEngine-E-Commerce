const mongoose = require("mongoose");
const Joi = require("joi");

const Cart = mongoose.model("Cart", new mongoose.Schema({
 userId: { 
  type : mongoose.Schema.Types.ObjectId,
  ref: "Users",
  required: true, 
 },
 itemId: [{ 
  type : mongoose.Schema.Types.ObjectId,
  ref: "Items",
  required: true, 
 }],
 size: {
  type: Array,
  required: true,
 },
 date: { type: Date, default: Date.now },
}));

function validateCart(params) {
 const schema = Joi.object({
  userId: Joi.string().required(),
  itemId: Joi.string().required(),
  size: Joi.array(),
 });
 return schema.validate(params);
}

module.exports.Cart = Cart;
module.exports.validateCart = validateCart;
