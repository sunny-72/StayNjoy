//requiring express
const express=require("express");
const app=express();

//defining port
let port=8080;

//Setting up ejs
const path=require("path");

//requiring ->models->listing
const Listing = require("./models/listing.js");

//requiring mongoose
const mongoose = require('mongoose');
let mongoURL="mongodb://127.0.0.1:27017/stayNjoy";

//requiring ejs-mate templating
const ejsMate=require("ejs-mate");

//setting view engine 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//using ejs-mate
app.engine("ejs",ejsMate);


//setting to understand url
app.use(express.urlencoded({extended:true}));

//method ovverride
const methodOverride=require("method-override");

//to use static file
app.use(express.static(path.join(__dirname,"/public")));


//handeling database connection
main().then(()=>{
    console.log("connection establised");
})
.catch((err) =>{console.log(err);});

//database connection
async function main() {
    await mongoose.connect(mongoURL);
  }

  //to use method
  app.use(methodOverride("_method"));

  //first route->index route
  app.get("/listings", async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index",{allListings});
  });

   //new route
   app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
  });

  //show route
  app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show",{listing});
  })
  
  //create route
  app.post("/listings",async (req,res)=>{
    // let listing=req.body.listing;
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    // console.log(listing);
  })

      //edit route
      app.get("/listings/:id/edit", async (req,res)=>{
        let {id}=req.params;
        const listing =await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
      });

       //update route
  app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // res.redirect("/listings/:id");
    res.redirect("/listings");
  });
//delete route
app.delete("/listings/:id",async (req,res)=>{
  let {id}=req.params;
  const deletedListing =await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
})


 

  /*
  // for testing purpose
  app.get("/testListing",async (req,res)=>{
   let sampleListing = new Listing({
    title:"my new villa",
    description:"by the beach",
    price:1200,
    location:"calinguta, goa",
    country:'india',
   });
   await sampleListing.save();
   console.log("sample was saved");
   res.send("successsfull tseting");
  });
  */
  app.get("/",(req,res)=>{
    res.send("hello travellers -> i am root");
  })

  app.listen(port,()=>{
    console.log("server is listening");
  })