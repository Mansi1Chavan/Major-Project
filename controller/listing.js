const List = require("../model/listing.js")

module.exports.index = async (req, res) => {
    const allListings = await List.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
} 

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await List.findById(id)
        .populate({
            path: "reviews",
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist")
        res.redirect("/list");

    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    let url  = req.file.path;
    let filename = req.file.filename;
    
    let newListing = new List(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("./list");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await List.findById(id);
    console.log(listing)
    res.render("listings/edit", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    await List.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    return res.redirect("/list");
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await List.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully")
    res.redirect("/list");
    console.log(deletedListing)
}