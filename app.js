//jshint esversion:6
require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home")
})

app.get("/register",function(req,res){
  res.render("register")
})

app.get("/login",function(req,res){
res.render("login")
})

app.post("/register",function(req,res){


  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets")
    }
  })
})


app.post("/login",function(req,res){
  const email = req.body.username
  const password = req.body.password
User.findOne({email:email},function(err,foundCred){
  if(err){
    console.log(err);
  }else{
    if(foundCred){
      if(foundCred.password === password){
        res.render("secrets")
      }
    }
  }

})
})


app.listen("3000",function(){
  console.log("Server running on port 3000");
})
