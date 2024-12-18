const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js")


const listings = require("./routes/listing.js")
const review = require("./routes/review.js");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set('views', path.join(__dirname, "views"));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const sessionOption = {
    secret: "mysupersecret",
    resave:false,
    saveUniInitialize: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60* 60  * 1000,
        maxAge: 7 * 24 * 60* 60  * 1000,
        httpOnly : true,
    }
}

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

app.use(session(sessionOption));
app.use(flash())


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log(success)
    next();
})

app.use("/list" , listings)
app.use("/list/:id/reviews", review)

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});