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

//importing wrapAsync
const wrapAsync=require("./utils/wrapAsync.js");

//importing expresserror
const ExpressError=require("./utils/ExpressError.js");

//requiring schema for schema validation:joi
const {listinSchema, listingSchema}=require("./schema.js");

                       ////////////////////////////


//handeling database connection
main().then(()=>{
    console.log("connection establised");
})
.catch((err) =>{console.log(err);});

//database connection
async function main() {
    await mongoose.connect(mongoURL);
  }

         ////////////////////////////

//to use method
app.use(methodOverride("_method"));

                     ////////////////////////////


  //validation for schema->Middleware->joi
  const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,error);
    }else{
      next();
    }
  };

  //first route->index route
  app.get("/listings",wrapAsync( async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
   
  }));  
                   ////////////////////////////

   //new route
   app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
  });
                  ////////////////////////////

  //show route
  app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
  }));   

              ////////////////////////////


  
  //create route
  
  app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
     const newListing=new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
     console.log("hello");
    
  }));


  //new create route->create route
  /*
  app.post("/listings", async (req, res, next) => {
    try{

        // Validate that specific fields are strings
        const listingData = req.body.listing;

        // Replace 'fieldName' with the actual field names you want to validate
        if (typeof listingData.country !=='string'|| !isNaN(listingData.country)||
            typeof listingData.location !=='string'|| !isNaN(listingData.location) ||
            typeof listingData.description !=='string'|| !isNaN(listingData.description) ||
            typeof listingData.title !=='string'|| !isNaN(listingData.title)) {
            throw new Error("Invalid data type: Expected a string.");
        }

      //Create a new listing
            const newListing = new Listing(listingData);
            await newListing.save();

            res.redirect("/listings");
      }catch(err){
        next(err);
      }

    });  
    */ 
                      ////////////////////////////

//edit route
      app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
        let {id}=req.params;
        const listing =await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
      }));

                       ////////////////////////////

//update route
      app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
      // res.redirect("/listings");
  }));

//new update route with validation
/*
app.put("/listings/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    const listingData = req.body.listing;

    // Validate that fields are strings and not numeric strings
    if (
      typeof listingData.country !== 'string' || !isNaN(listingData.country) ||
      typeof listingData.location !== 'string' || !isNaN(listingData.location) ||
      typeof listingData.description !== 'string' || !isNaN(listingData.description) ||
      typeof listingData.title !== 'string' || !isNaN(listingData.title)
    ) {
      throw Error("Invalid data type: Expected a string.");
    }
// Update the listing
    await Listing.findByIdAndUpdate(id, { ...listingData });
    res.redirect("/listings"); // Redirect to the updated listing page
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});
*/

                  ////////////////////////////


//delete route
app.delete("/listings/:id",async (req,res)=>{
  let {id}=req.params;
  const deletedListing =await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

                  ////////////////////////////
 

  
  // for testing purpose
  /*
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

         ////////////////////////////

 //route 
  app.get("/",(req,res)=>{
    res.send("hello travellers -> i am root");
  })



        ////////////////////////////

//error handling->for any route
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found okay!"));
});


         ////////////////////////////

// Middleware for error handling
app.use((err, req, res, next) => {
  let {statusCode=500,message="somthing went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // console.error(err.stack); // Log the error stack for debugging
  // res.status(statusCode).send(message);
  
});

             ////////////////////////////

             
  app.listen(port,()=>{
    console.log("server is listening");
  })