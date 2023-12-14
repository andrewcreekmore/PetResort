import express = require("express");
import catchAsync = require("../../utils/catchAsync");
const kennels = require("../../controllers/admin/kennels.controller");
const { isLoggedIn, isAdmin } = require("../../middleware");

/*
===========================================================================
kennels.route.ts
- kennel record CRUD routes; admin-access only
===========================================================================
*/

const router = express.Router();
const path = '/kennel-records'

// require login for all kennel records routes
router.all('*', isLoggedIn)

// registration of new kennels - form entry
router.get("/new", isAdmin, kennels.renderNewForm);

// registration of new kennels - add on server
router.post("/", isAdmin, catchAsync(kennels.createKennel));

// service records: update single record - form entry
router.get("/:id/edit", isAdmin, catchAsync(kennels.renderEditForm));

router
	.route("/:id")
	// kennel records: update single record - edit on server
	.put(isAdmin, catchAsync(kennels.updateKennel))
	// kennel records: delete single record
	.delete(isAdmin, catchAsync(kennels.deleteKennel));

module.exports = { router, path };