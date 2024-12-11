const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../model/review.js");
const List = require("../model/listing.js")


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.error("Validation Error:", error.details.map(e => e.message).join(", "));
        throw new ExpressError(400, "Invalid review data");
    }
    next();
};

//post review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await List.findById(req.params.id);
    if (!listing) {
        console.error("Listing not found.");
        throw new ExpressError(404, "Listing not found");
    }

    if (!listing.reviews) {
        listing.reviews = [];
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/list/${listing._id}`);
}));

//delete review
router.delete("/:reviewId", wrapAsync(async(req,res) => {
  let { id, reviewId } = req.params;
   await List.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/list/${id}`)
}));

module.exports= router