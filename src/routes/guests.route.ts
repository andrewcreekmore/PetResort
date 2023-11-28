import express = require("express");
import multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });
import catchAsync = require("../utils/catchAsync");
const guests = require('../controllers/guests.controller')
import { validateGuest } from "../validationFunctions";
const { isLoggedIn } = require("../middleware");

/*
===========================================================================
guests.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();
const path = "/guest-records";

// require login for all guest records routes
router.all('*', isLoggedIn)

// for ajax setting of activeAdminTab
//router.post("/setActiveTab", guests.setActiveTab);

router.route("/")
	// guest records: view all / index
	.get(catchAsync(guests.index))
    // guest records: create new record - add on server
    .post(upload.single("imageFileInput"), validateGuest, catchAsync(guests.createGuest));

// guest records: create new record - form entry
router.get("/new", catchAsync(guests.renderNewForm));

router.route("/:id")
    // guest records: view single record details
    .get(catchAsync(guests.showDetails))
    // guest records: update single record - edit on server
    .put(upload.single("imageFileInput"), validateGuest, catchAsync(guests.updateGuest))
    // guest records: delete single record
    .delete(catchAsync(guests.deleteGuest));

// guest records: update single record - form entry
router.get("/:id/edit", catchAsync(guests.renderEditForm));

// guest records: remove photo (reset to placeholder)
router.put("/removePhoto/:id", catchAsync(guests.removePhoto));

module.exports = { router, path };