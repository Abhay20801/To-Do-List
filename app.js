 //jshint esversion:6
 const express = require("express");
 const bodyParser = require("body-parser");
 const mongoose = require("mongoose");
 //const date = require(__dirname + "/date.js");  // when we have to require date

 const app = express();
 /* Withou the use of mongo
 let items = ["buy food","cook food"];
 let workItems = [];
 */
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"));
 app.set('view engine', 'ejs');
 mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true});

 const itemSchema = {
   name: {
      type : String,
      requied: [true,"Pease enter the name"]
   }
 };

 const Item = mongoose.model("Item",itemSchema);

 const item1 = new Item({
   name: "Welcome to your To-do list"
 });

 const item2 = new Item({
   name: "Hit the + button to add a new item."
 });

 const item3 = new Item({
   name: "<-- Hit this delete an item."
 });

 const defaultItems = [item1,item2,item3]; 

 const listSchema = {
   name: String,
   items: [itemSchema]
 };

 const List = mongoose.model("List",listSchema);

 app.get("/",function(req,res){

   /* used when we created this using EJS not used with mongoose
   let day = date.getDay()
   */

   Item.find({}, function(err, foundItems) {
      if (foundItems.length === 0 ) {
         Item.insertMany(defaultItems,function(err) {
            if (err) {
               console.log(err);
            } else {
               console.log("Item is successfully added to the list");
            }
         });
         res.redirect("/");
      } else {
         res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
      
   }); 


 });

 app.get("/:customListName", function(req,res){
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function(err, foundList){
   if (!err){
      if(!foundList){
         //Create a new lists
         const list = new List ({
            name: customListName,
            items: defaultItems
         });
         list.save();
         res.redirect("/"+ customListName);
      } else {
         //Show an existing list 

         res.render("list",{listTitle: foundList.name, newListItems: foundList.items})
      }
   }
  });

   const List = new List({
      name: customListName,
      items: defaultItems
   });

   List.save();

 });
 
app.post("/",function(req,res){

   
   let itemName = req.body.newItem;
   
   const item = new Item ({
      name: itemName
   });

   item.save();
   res.redirect("/");
});

app.post("/delete",function(req,res){
   const checkedItemId = req.body.checkbox;

   Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
         console.log("Succesfuuly deleted checked item");
         res.redirect("/");
      }
   })
});

app.get("/work",function(req,res){
   res.render("list",{listTitle: "Work Title", newListItems: workItems});
});

app.post("/work",function(req,res){
   let item = req.body.newItem;
   workItems.push(item);
   res.redirect("/work");
});
app.get("/about",function(req,res){
   res.render("about");
})

 app.listen(3000, function(){
    console.log("The server is running on port 3000");
 });