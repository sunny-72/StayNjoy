const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

let mongoURL="mongodb://127.0.0.1:27017/stayNjoy";
//handeling database connection
main().then(()=>{
    console.log("connection establised");
})
.catch((err) =>{console.log(err);});

//database connection
async function main() {
    await mongoose.connect(mongoURL);
  }
  const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialised....!");
  }
  initDB();