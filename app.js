const {downloadImgFromS3} = require("./routes/s3")
const home = require("./routes/home");
const upload = require("./routes/upload");
const auth = require("./routes/auth");
const item = require("./routes/item");
const selectedItem = require("./routes/selectedItem");
const cart = require("./routes/cart");
const checkout = require("./routes/checkout");
const ejs = require("ejs");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

mongoose
 .connect(process.env.DB, { useNewUrlParser: true})
 .then(() => console.log("Connected to the database"))
 .catch((err) => console.log("MongoDB failed to connect to the server", err));

app.use(express.json());
// show static files
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/imgs", express.static(__dirname + "/public/imgs"));
app.use("/imgUploads", express.static(__dirname + "/public/imgUploads"));

app.set("view engine", "ejs");

app.use("/", home);
app.use("/upload", upload);
app.use("/account", auth);
app.use("/item", item);
app.use("/selectedItem", selectedItem);
app.use("/cart", cart);
app.use("/checkout", checkout);

app.get("/images/:key", (req, res)=>{
 const key = req.params.key
 const readStream = downloadImgFromS3(key)
 readStream.pipe(res)
})

app.use((req, res, next) => {
 res.status(404).send("404 Could not find Page")
})
const port = process.env.PORT ||  9999;
app.listen(port, () => console.log(`connected to the port ${port}`));
