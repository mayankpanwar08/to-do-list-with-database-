//jshint esversion:6
const express = require("express");   //to require express 
const bodyParser = require("body-parser"); // to require bodyparser
const mongoose = require("mongoose");   // to require mongoose which we install in our package.json
const app = express();

app.set('view engine', 'ejs');   //from ejs documentations of using ejs with express

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // help to run css we need to put our css in public folder

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true }); //to made a connection with the running server which will run with mongod command

//Created Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

//Created model
const Item = mongoose.model("Item", itemsSchema);

//Creating items
const item1 = new Item({
  name: "Welcome! What is for Today?"
});

const item2 = new Item({
  name: "Click + to add a new item."
});

const item3 = new Item({
  name: "Mark Checkbox to delete an item."
});

//Storing items into an array
const defaultItems = [item1, item2, item3];

//In latest version of mongoose insertMany has stopped accepting callbacks
//instead they use promises
//So ".then" & "catch" are part of PROMISES IN JAVASCRIPT.

//PROMISES in brief
//In JS, programmers encountered a problem called "callback hell", where syntax of callbacks were cumbersome & often lead to more problems.
//So in effort to make it easy PROMISES were invented.

app.get("/", function (req, res) {
  //printing all store values in terminal (In my case Hyper Terminal)
  Item.find({}).then(foundItem => {
    if (foundItem.length === 0) {
      return Item.insertMany(defaultItems);
    } else {
      return foundItem;
    }
  })
    .then(savedItem => {
      res.render("list", { listTitle: "Today Work TO DO 🥵", newListItems: savedItem });
    })
    .catch(err => console.log(err));

});

// add new items to list and after adding it will redirect to home route
app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({

    name: itemName

  });

  item.save();

  res.redirect("/");

});

//deleting the items which are checked from the list as well as from database and then redirect to home route 

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});