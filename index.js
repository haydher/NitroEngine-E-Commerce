const home = require("./routes/home");
const upload = require("./routes/upload");
const auth = require("./routes/auth");
const item = require("./routes/item");
const selectedItem = require("./routes/selectedItem");
const cart = require("./routes/cart");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

//
// .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eeejx.mongodb.net/NitroEngine?retryWrites=true&w=majority`, { useNewUrlParser: true })
mongoose
 // .connect("mongodb://localhost/NitroEngine", { useNewUrlParser: true })
 .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nitroengine.kgaw6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true })
 .then(() => console.log("Connected to the database"))
 .catch((err) => console.log("failed to connect to the server", err));

app.set("view engine", "ejs");
app.use(express.json());
// show static files
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/imgs", express.static(__dirname + "/public/imgs"));
app.use("/imgUploads", express.static(__dirname + "/public/imgUploads"));

app.use("/", home);
// app.get("/", (req, res)=> {
//  res.render("index")
// })
app.use("/upload", upload);
app.use("/account", auth);
app.use("/item", item);
app.use("/selectedItem", selectedItem);
app.use("/cart", cart);

const port = process.env.PORT || 9999;
app.listen(port, () => console.log(`connected to the port ${port}`));
