const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require ("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb+srv://sohab_abid:sabiabid980@cluster0.qgmiz.mongodb.net/todolistDB',{useNewUrlParser: true})
var itemSchema = new mongoose.Schema({
  name: String
});
var Item = mongoose.model("Item",itemSchema);
// var addItems=["Buy Food","Cook Food","Eat Food"];
// var workItems=[];

var item1 = new Item({
  name: "Welcome to todolist"
});
var item2 = new Item ({
  name: "Hit + button to add new list item"
});
var item3 = new Item ({
  name: "Click checkbox to delete an item"
});

var defaultItems=[item1,item2,item3];
var routingItems=[];

app.use(express.static("public"));
app.get("/", function(req, res) {
  //javascript funtion to get current date
  var today = new Date();
  var options={
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  var day=today.toLocaleDateString("en-US",options);

  Item.find({},function(err,items){
    if (items.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved values in DB");
        }
      });
      res.redirect("/");
    }else{

      res.render("list", {
        currentDay: "Today", item: items , route: "/"
      });
    }
  });

  //var currentDay = today.getDay()
});

app.post("/",function(req,res){
  var addItem=req.body.newItem;
  const newItem = new Item({
    name: addItem
  });
  //defaultItems.push(newItem);
  newItem.save();
  res.redirect("/");

  //console.log(addItem);
});
app.post("/delete",function(req,res){
  const checkedItem=req.body.checkbox;
  const listName = _.capitalize(req.body.listName);
  console.log(checkedItem);
if(listName==="Today"){
  Item.findByIdAndRemove(checkedItem,function(err){
    if (err){
      console.log(err);
    }else{
      console.log("Success");
    }
  });
  res.redirect("/");
}else{
  var Topic = mongoose.model(listName,itemSchema);
  Topic.findByIdAndRemove(checkedItem,function(err){
    if (err){
      console.log(err);
    }else{
      console.log("Success");
    }
  });
  res.redirect("/"+listName);
}

});


app.get("/:topic",function(req,res){
  var router=_.capitalize(req.params.topic);
  var Topic = mongoose.model(router,itemSchema);
  Topic.find({},function(err,items){
    res.render("list", {
      currentDay: router, item: items , route: "/"+router
    });
  });
  });



app.post("/:topic",function(req,res){
  var router=_.capitalize(req.params.topic);
  var Topic = mongoose.model(router,itemSchema);
  const newRouteItem = new Topic({
    name: req.body.newItem
  });
  newRouteItem.save();
  const checkedItem=req.body.checkbox;
  console.log(checkedItem);
  Item.findByIdAndRemove(checkedItem,function(err){
    if (err){
      console.log(err);
    }else{
      console.log("Success");
      res.redirect("/"+req.params.topic);
    }
  });

});
// app.get("/work",function(req,res){
//   res.render("list", {
//     currentDay: "Work List", item: workItems, route: "/work"
//   });
// });

// app.post("/work",function(req,res){
//   var addItem=req.body.newItem;
//   workItems.push(addItem);
//   res.redirect("/work");
// });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started at port 3000");
});
