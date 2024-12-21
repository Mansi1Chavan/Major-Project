const List = require("../model/listing.js")
const Review = require("../model/review.js")


module.exports.createReview = async (req, res) => {
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
}

module.exports.destroyReview = async(req,res) => {
    let { id, reviewId } = req.params;
     await List.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review Deleted ")
     res.redirect(`/list/${id}`)
  }
