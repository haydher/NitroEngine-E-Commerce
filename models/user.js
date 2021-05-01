
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");

const cart = new mongoose.Schema({
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
});

const prevOrder = new mongoose.Schema({
 itemId: { 
  type : mongoose.Schema.Types.ObjectId,
  ref: "Items",
  required: true, 
 },
 size: {
  type: String,
  required: true,
 },
 date: { type: Date, default: Date.now },
});

const PrevOrder = mongoose.model("PrevOrder", prevOrder);

const userSchema = new mongoose.Schema({
 firstName: {
  type: String,
  required: true,
 },
 lastName: {
  type: String,
  required: true,
 },
 gender: {
  type: String,
  required: true,
 },
 dob: {
  type: Date,
  required: true,
 },
 username: {
  type: String,
  required: true,
  unique: true,
 },
 email: {
  type: String,
  required: true,
  unique: true,
 },
 phone: {
  type: String,
  required: true,
  unique: true,
 },
 password: {
  type: String,
  required: true,
 },
 giftValue: {
  type: Number,
  default: 99999,
 },
 date: {
  type: Date,
  default: Date.now,
 },
 isAdmin: {
  type: Boolean,
  default: false,
 },
 userCart: [cart],
 prevOrders: [prevOrder],
});

userSchema.methods.verifyPassword = function (password) {
 return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
 return jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, process.env.JWT_TOKEN);
};
const User = mongoose.model("Users", userSchema);


function validateUser(params) {
 const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().required().lowercase(),
  dob: Joi.date().required(),
  username: Joi.string().required().lowercase(),
  email: Joi.string().required().email().lowercase(),
  phone: Joi.string().min(10).required(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean(),
 });
 return schema.validate(params);
}


function validateLogin(params) {
 const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
 });
 return schema.validate(params);
}

module.exports.User = User;
module.exports.PrevOrder = PrevOrder;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;



// const Joi = require("joi");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const express = require("express");

// const userSchema = new mongoose.Schema({
//  firstName: {
//   type: String,
//   required: true,
//  },
//  lastName: {
//   type: String,
//   required: true,
//  },
//  username: {
//   type: String,
//   required: true,
//   unique: true,
//  },
//  email: {
//   type: String,
//   required: true,
//   unique: true,
//  },
//  phone: {
//   type: String,
//   required: true,
//   unique: true,
//  },
//  password: {
//   type: String,
//   required: true,
//  },
//  date: {
//   type: Date,
//   default: Date.now,
//  },
//  isAdmin: {
//   type: Boolean,
//   default: false,
//  },
// });

// userSchema.methods.verifyPassword = function (password) {
//  return bcrypt.compareSync(password, this.password);
// };

// const User = mongoose.model("Users", userSchema);

// function validateUser(params) {
//  const schema = Joi.object({
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   username: Joi.string().required(),
//   email: Joi.string().required().email(),
//   phone: Joi.string().required(),
//   password: Joi.string().required(),
//   isAdmin: Joi.boolean(),
//  });
//  return schema.validate(params);
// }

// module.exports.User = User;
// module.exports.validateUser = validateUser;
