const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:
                "https://drive.google.com/file/d/192VG9nP7ehwCbsWGuYakOxskFpFB4qkA/view?usp=drivesdk",
            set:(v)=>
                 v ===""
                 ?"https://drive.google.com/file/d/192VG9nP7ehwCbsWGuYakOxskFpFB4qkA/view?usp=drivesdk"
                :v,
            }},
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

