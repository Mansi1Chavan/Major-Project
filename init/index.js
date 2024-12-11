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
   await List.insertMany(database.data);
   console.log("inserted data");

}
initDB();
