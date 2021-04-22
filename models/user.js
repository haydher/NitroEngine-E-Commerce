
const Joi = require("joi");
const bcrypt = require("bcryptjs");
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

const userSchema = new mongoose.Schema({
 firstName: {
  type: String,
  required: true,
 },
 lastName: {
  type: String,
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
 date: {
  type: Date,
  default: Date.now,
 },
 isAdmin: {
  type: Boolean,
  default: false,
 },
 userCart: [cart],
});

userSchema.methods.verifyPassword = function (password) {
 return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("Users", userSchema);

function validateUser(params) {
 const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required().email(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean(),
 });
 return schema.validate(params);
}

module.exports.User = User;
module.exports.validateUser = validateUser;



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
