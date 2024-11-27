const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title : String,
    description : String,
    image :{
        filename : String,
        url: String,
    },
    price : Number,
    location :String,
    country : String
});

const List = mongoose.model("List", listingSchema);

module.exports = List;