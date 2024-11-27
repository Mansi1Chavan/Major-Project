const express = require("express");
const mongoose = require("mongoose");
const app = express();
const List = require("./model/listModel.js")
const initDB = require("./init/index.js");
const database = require("./init/data.js");
const path = require("path");


main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("error");
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/myapp")
}

app.get("/", (req, res) => {
    res.send("Hii, Response sent");
})

app.get("/list", async (req, res) => {
    const allInfo = await List.find({});
    res.render("./listing/app.ejs", { allInfo });
})

app.get("/list/new", (req, res) => {
    res.render("listing/new.ejs")
})

// app.post("/list", async (req, res) => {
//     const { title, description, image, price, location, country } = req.body.title;
//     console.log("Data saved:", title);
// })

    // app.post("/list", async (req, res) => {
    //     const listed = req.body.objData;
    //     console.log("Data saved:",listed);
    // });

    // app.post("/list", (req, res) => {
    //     const { title, description, image, price, location, country } = req.body.objData;
    //     console.log("Received Data:", { title, description, image, price, location, country });
    //     res.send("Data received and displayed in terminal.");
    // });

    // app.post("/list", (req, res) => {
    //     const { objData } = req.body; // Extract `objData` from `req.body`
    //     console.log("Received Data:", objData); // Log the nested `objData`
    //     res.send("Data received and displayed in terminal.");
    // });

    app.post("/list", (req, res) => {
        console.log("Received Data:", req.body); // Directly access req.body without destructuring objData
        res.send("Data received and logged.");
    });
    
app.get("/list/:id", async (req, res) => {
    let { id } = req.params;
    const dataById = await List.findById(id);
    res.render("show.ejs", { dataById });
})

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});