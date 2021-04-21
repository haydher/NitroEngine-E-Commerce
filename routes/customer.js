const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
 const customer = await Customer.find();
 res.send(customer);
});

router.post("/", async (req, res) => {
 let newCustomer = new Customer(req.body);

 const validate = validateCustomer(req.body);
 if (validate.error != undefined) return res.status(400).send(validate.error.details[0].message);

 try {
  newCustomer = await newCustomer.save();
  res.send(newCustomer);
 } catch (exception) {
  for (Field in exception.errors) console.log("Error: ", exception.errors[Field].message);
 }
});

router.get("/id", async (req, res) => {
 return res.status(400).send(`Please enter a valid ID.`);
});

router.get("/id/:id", async (req, res) => {
 // const paramID = `${req.params.id}`;
 let customerID;
 try {
  customerID = await Customer.find({ _id: { $in: [req.params.id] } });
 } catch (error) {
  console.log("ERROOOOR:", error);
  return res.status(400).send(`No item with the ID of ${req.params.id} exists`);
 }
 res.send(customerID);
});

router.put("/id/:id", async (req, res) => {
 const paramID = `${req.params.id}`;
 let customer;
 try {
  customer = await Customer.findByIdAndUpdate(paramID, { $set: req.body }, { new: true });
 } catch (error) {
  console.log("ERROOOOR:", error);
  return res.status(400).send(`No Customer with the ID of ${req.params.id} exists`);
 }

 const validate = validateCustomer(req.body);
 if (validate.error != undefined) return res.status(400).send(validate.error.details[0].message);

 res.send(customer);
});

router.delete("/id/:id", async (req, res) => {
 const deleteCustomer = await Customer.findByIdAndRemove(req.params.id, { useFindAndModify: false });
 if (!deleteCustomer) return res.status(400).send(`No item with the ID of ${req.params.id} exists`);
 res.send(deleteCustomer);
});

module.exports = router;
