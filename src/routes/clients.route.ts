import express = require("express");
import catchAsync = require("../utils/catchAsync");
import { validateClient } from "../validationFunctions";
const clients = require('../controllers/clients.controller')
const { isLoggedIn } = require("../middleware");

/*
===========================================================================
clients.route.ts
- client records routes
===========================================================================
*/

// init router
const router = express.Router();
const path = '/client-records'

// require login for all client records routes
router.all('*', isLoggedIn)

router.route("/")
	// client records: view all / index
	.get(catchAsync(clients.index))
	// client records: create new record - add on server
	.post(validateClient, catchAsync(clients.createClient));

// client records: create new record - form entry
router.get("/new", clients.renderNewForm);

router.route("/:id")
	// client records: view single record details
	.get(catchAsync(clients.showDetails))
	// client records: update single record - edit on server
	.put(validateClient, catchAsync(clients.updateClient))
	// client records: delete single record
	.delete(catchAsync(clients.deleteClient))

// client records: update single record - form entry
router.get("/:id/edit", catchAsync(clients.renderEditForm));

module.exports = { router, path };