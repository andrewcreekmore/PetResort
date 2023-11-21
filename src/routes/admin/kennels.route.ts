import express = require("express");
import catchAsync = require("../../utils/catchAsync");
import { validateKennel } from "../../validationFunctions";
const kennels = require("../../controllers/admin/kennels.controller");
const { isLoggedIn } = require("../../middleware");

/*
===========================================================================
kennels.route.ts
- kennel record routes; admin-access only
===========================================================================
*/

const router = express.Router();

// require login for all kennel records routes
router.all('*', isLoggedIn)

// registration of new kennels - form entry
router.get("/new", kennels.renderNewForm);

// registration of new kennels - add on server
router.post("/", catchAsync(kennels.createKennel));

// service records: update single record - form entry
router.get("/:id/edit", catchAsync(kennels.renderEditForm));

router
	.route("/:id")
	// kennel records: update single record - edit on server
	.put(catchAsync(kennels.updateKennel))
	// kennel records: delete single record
	.delete(catchAsync(kennels.deleteKennel));

module.exports = router;