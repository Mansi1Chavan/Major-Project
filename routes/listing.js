const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateSchema } = require("../middleware.js")
const multer = require('multer');
const { storage } = require("../cloudConflict.js")
const upload = multer({ storage });

const listingController = require("../controller/listing.js");


router.route("/")
      .get(wrapAsync(listingController.index))
      .post(
            isLoggedIn,
            upload.single('listing[image]'),
            validateSchema,
            wrapAsync(listingController.createListing)
      );


//add new list route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
      .get(wrapAsync(listingController.showListing))
      .put(
            isLoggedIn, 
            upload.single('listing[image]'),
            validateSchema, 
            wrapAsync(listingController.updateListing))
      .delete(isLoggedIn, wrapAsync(listingController.destroyListing))


//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;