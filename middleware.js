const List = require("./model/listing");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
   console.log(req.path, "..", req.originalUrl)
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl
    req.flash("error", "You must be logged in");
    return res.redirect("/login")

    }
    next();
    
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// module.exports.isOwner = async(req, res, next) => {
//     let { id } = req.params;
//     let listing = List.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//      req.flash("error","Only owner's have right to edit the page.")
//      return res.redirect(`/list/${id}`)  
//     }
//     next();
// }

module.exports.validateSchema = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((e) => e.message).join(",")
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.error("Validation Error:", error.details.map(e => e.message).join(", "));
        throw new ExpressError(400, "Invalid review data");
    }
    next();
};