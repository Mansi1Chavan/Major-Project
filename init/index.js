const mongoose = require("mongoose");
const List = require("../model/listing.js");
const database = require("./data.js");

  
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("error");
});

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/myapp")
}

const initDB =  async () => {
   await List.deleteMany({});
   database.data = database.data.map((obj) => ({...obj, owner: "675fc708b0b26fbf7933add0" }))
   await List.insertMany(database.data);
}

initDB();
