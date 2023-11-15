import express = require("express");
import catchAsync = require("../utils/catchAsync");
const visits = require("../controllers/visits.controller");
import { validateVisit } from "../validationFunctions";
const { isLoggedIn } = require("../middleware");

/*
===========================================================================
visits.route.ts
- 
===========================================================================
*/

// init router
const router = express.Router();

// require login for all visit records routes
router.all('*', isLoggedIn)

// visit records: create new record - form entry
router.get("/new/:id", catchAsync(visits.renderNewForm));

// visit records: create new record - add on server
router.post("/", validateVisit, catchAsync(visits.createVisit));

router
	.route("/add-service/:id")
	// visit records: add service to record - form entry
	.get(catchAsync(visits.renderAddServiceForm))
	// visit records: add service to single record - edit on server
	.put(catchAsync(visits.addServiceToVisit));

// visit records: toggle service status - edit on server
router.put("/toggleServiceStatus/:id", catchAsync(visits.toggleServiceStatus));

router.route("/:id")
	// visit records: view single record details
	.get(catchAsync(visits.index))
	// visit records: update single record - edit on server
	.put(validateVisit, catchAsync(visits.updateVisit))
	// visit records: delete single record
	.delete(catchAsync(visits.deleteVisit));

// visit records: update single record - form entry
router.get("/:id/edit", catchAsync(visits.renderEditForm));



module.exports = router;