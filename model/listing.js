const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename:String,   
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            default:[],
        }
    ],
    owner: {
       type: Schema.Types.ObjectId ,
       ref: "User",
    },
});

listingSchema.post("findOneAndDelete" ,async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const List = mongoose.model("List", listingSchema);
console.log(List)
module.exports = List;

