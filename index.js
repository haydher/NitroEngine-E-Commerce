const home = require("./routes/home");
const upload = require("./routes/upload");
const auth = require("./routes/auth");
const item = require("./routes/item");
const selectedItem = require("./routes/selectedItem");
const cart = require("./routes/cart");
const test = require("./routes/test");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

// mongoose
//  .connect(process.env.DB, { useNewUrlParser: true })
//  .then(() => console.log("Connected to the database"))
//  .catch((err) => console.log("MongoDB failed to connect to the server", err));


// setInterval(() => {
//  console.log("mongoose connection status", mongoose.connection.readyState)
// }, 2000);



app.set("view engine", "ejs");
app.use(express.json());
// show static files
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/imgs", express.static(__dirname + "/public/imgs"));
app.use("/imgUploads", express.static(__dirname + "/public/imgUploads"));

app.use("/", home);
app.use("/test", (req, res)=> {
 res.send("in test")
});
app.use("/upload", upload);
app.use("/account", auth);
app.use("/item", item);
app.use("/selectedItem", selectedItem);
app.use("/cart", cart);

const port = process.env.PORT ||  9999;
app.listen(port, () => console.log(`connected to the port ${port}`));
