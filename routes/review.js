const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../model/review.js");
const List = require("../model/listing.js")
const { validateReview, isLoggedIn } = require("../middleware.js");

const reviewController = require("../controller/review.js")

//post review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId", wrapAsync(reviewController.destroyReview));

module.exports= router