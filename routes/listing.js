const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const List = require("../model/listing.js")



const validateSchema = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((e) => e.message).join(",")
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}

//index route 
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await List.find({});
    res.render("./listings/index.ejs", { allListings });
}));

//add new list route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await List.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing does not exist")
        res.redirect("/list");

    }
    res.render("listings/show", { listing });
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await List.findById(id);
    res.render("listings/edit", { listing });
}));

//create route
router.post("/list", validateSchema, wrapAsync(async (req, res) => {
    let newListing = new List(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("./list");
}));

//update route
router.put('/:id', validateSchema, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/list")
}))

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await List.findByIdAndDelete(id);
    res.redirect("/list");
    console.log(deletedListing)
}))

module.exports = router;