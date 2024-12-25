if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const atlas_url = process.env.MONGODB_URL;

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set('views', path.join(__dirname, "views"));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store =  MongoStore.create({
    mongoUrl: atlas_url,
    crypto: {
        secret: process.env.CLOUD_API_SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session store", err)
})

const sessionOption = {
    store,
    secret: process.env.CLOUD_API_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60* 60  * 1000,
        maxAge: 7 * 24 * 60* 60  * 1000,
        httpOnly : true,
    },
};

async function main() {
    await mongoose.connect(atlas_url)
}

main().then(() => {
    console.log("connected to DB_ATLAS");
}).catch((err) => {
    console.log("error due to atlas");
});


// app.get("/", (req, res) => {
//     res.render("./listings/index.js");
// })

app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    next();
})

app.use("/list" , listingRouter)
app.use("/list/:id/reviews", reviewRouter)
app.use("/", userRouter)

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